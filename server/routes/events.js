const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../db');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validateEvent, handleValidationErrors } = require('../middleware/validation');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/events');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category_id = '', upcoming = '', sort_by = 'date_asc' } = req.query;
    const offset = (page - 1) * limit;

    // Filter: only active events that are NOT archived
    let whereClause = "WHERE e.is_active = 1 AND e.status != 'archived'";
    let params = [];

    if (search) {
      whereClause += ' AND (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category_id) {
      whereClause += ' AND e.category_id = ?';
      params.push(category_id);
    }

    if (upcoming === 'true') {
      whereClause += ' AND e.event_date > NOW()';
    }

    // Determine sort order
    let orderClause = 'ORDER BY e.event_date ASC'; // Default: nearest first
    switch (sort_by) {
      case 'date_desc':
        orderClause = 'ORDER BY e.event_date DESC';
        break;
      case 'title_asc':
        orderClause = 'ORDER BY e.title ASC';
        break;
      case 'title_desc':
        orderClause = 'ORDER BY e.title DESC';
        break;
      case 'price_asc':
        orderClause = 'ORDER BY e.price ASC';
        break;
      case 'price_desc':
        orderClause = 'ORDER BY e.price DESC';
        break;
      case 'date_asc':
      default:
        orderClause = 'ORDER BY e.event_date ASC';
        break;
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM events e ${whereClause}`,
      params
    );

    // Get events with category info and registration count
    const [events] = await query(
      `SELECT e.*, c.name as category_name, e.image as image_url,
              (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations,
              CASE 
                WHEN e.event_date < NOW() THEN 'past'
                WHEN e.event_date > NOW() THEN 'upcoming'
                ELSE 'ongoing'
              END as event_status
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       ${whereClause}
       ${orderClause}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const result = {
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      }
    };

    return ApiResponse.success(res, result, 'Events retrieved successfully');

  } catch (error) {
    console.error('Get events error:', error);
    return ApiResponse.error(res, 'Failed to get events');
  }
});

// Get event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if admin is requesting (for edit purposes)
    const isAdmin = req.user && req.user.role === 'admin';

    const [events] = await query(
      `SELECT e.*, c.name as category_name, e.image as image_url,
              (SELECT COUNT(*) FROM registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.id = ? ${!isAdmin ? 'AND e.is_active = 1 AND e.status != \'archived\'' : ''}`,
      [id]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    return ApiResponse.success(res, events[0], 'Event retrieved successfully');

  } catch (error) {
    console.error('Get event error:', error);
    return ApiResponse.error(res, 'Failed to get event');
  }
});

// Create event (admin only)
router.post('/', authenticateToken, requireUser, upload.single('image'), async (req, res) => {
  try {
    const { title, description, short_description, event_date, event_time, end_date, end_time, location, address, city, province, category_id, max_participants, price, is_free, status } = req.body;

    // Validate required fields
    if (!title || !description || !event_date || !event_time || !location || !category_id) {
      return ApiResponse.badRequest(res, 'Missing required fields');
    }

    // Check if admin can create event (max H-3 from event date)
    const eventDate = new Date(event_date);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    if (eventDate < threeDaysFromNow) {
      return ApiResponse.badRequest(res, 'Admin hanya dapat membuat event maksimal H-3 dari tanggal penyelenggaraan');
    }

    // Check if category exists
    const [categories] = await query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (categories.length === 0) {
      return ApiResponse.badRequest(res, 'Category not found');
    }

    // Get image path if uploaded
    const imagePath = req.file ? `/uploads/events/${req.file.filename}` : null;

    // Create event
    const [result] = await query(
      `INSERT INTO events (title, description, short_description, event_date, event_time, end_date, end_time, location, address, city, province, category_id, organizer_id, max_participants, price, is_free, image, banner, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, short_description || description.substring(0, 200), event_date, event_time, end_date || event_date, end_time || event_time, location, address || location, city || 'Jakarta', province || 'DKI Jakarta', category_id, req.user.id, max_participants || 50, price || 0, is_free === 'true' || is_free === true || price == 0, imagePath, null, status || 'published']
    );

    // Get created event
    const [events] = await query(
      `SELECT e.*, c.name as category_name 
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.id = ?`,
      [result.insertId]
    );

    return ApiResponse.created(res, events[0], 'Event created successfully');

  } catch (error) {
    console.error('Create event error:', error);
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    return ApiResponse.error(res, error.message || 'Failed to create event');
  }
});

// Update event (admin only)
router.put('/:id', authenticateToken, requireUser, validateEvent, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, short_description, event_date, event_time, end_date, end_time, location, address, city, province, category_id, max_participants, price, is_free, image_url, banner, status, is_active } = req.body;

    // Check if event exists
    const [existingEvents] = await query('SELECT id FROM events WHERE id = ?', [id]);
    if (existingEvents.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    // Check if category exists
    const [categories] = await query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (categories.length === 0) {
      return ApiResponse.badRequest(res, 'Category not found');
    }

    // Update event
    await query(
      `UPDATE events 
       SET title = ?, description = ?, short_description = ?, event_date = ?, event_time = ?, end_date = ?, end_time = ?, location = ?, address = ?, city = ?, province = ?, category_id = ?, 
           max_participants = ?, price = ?, is_free = ?, image = ?, banner = ?, status = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, short_description, event_date, event_time, end_date, end_time, location, address, city, province, category_id, max_participants, price || 0, is_free || false, image_url, banner, status, is_active, id]
    );

    // Get updated event
    const [events] = await query(
      `SELECT e.*, c.name as category_name 
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.id = ?`,
      [id]
    );

    return ApiResponse.success(res, events[0], 'Event updated successfully');

  } catch (error) {
    console.error('Update event error:', error);
    return ApiResponse.error(res, 'Failed to update event');
  }
});

// Delete event (admin only)
router.delete('/:id', authenticateToken, requireUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const [existingEvents] = await query('SELECT id FROM events WHERE id = ?', [id]);
    if (existingEvents.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    // Check if there are registrations
    const [registrations] = await query('SELECT id FROM registrations WHERE event_id = ?', [id]);
    if (registrations.length > 0) {
      return ApiResponse.conflict(res, 'Cannot delete event with existing registrations');
    }

    // Delete event
    await query('DELETE FROM events WHERE id = ?', [id]);

    return ApiResponse.success(res, null, 'Event deleted successfully');

  } catch (error) {
    console.error('Delete event error:', error);
    return ApiResponse.error(res, 'Failed to delete event');
  }
});

// Get upcoming events
router.get('/upcoming/events', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [events] = await query(
      `SELECT e.*, c.name as category_name,
              (SELECT COUNT(*) FROM registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.is_active = 1 AND e.event_date > NOW()
       ORDER BY e.event_date ASC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    return ApiResponse.success(res, events, 'Upcoming events retrieved successfully');

  } catch (error) {
    console.error('Get upcoming events error:', error);
    return ApiResponse.error(res, 'Failed to get upcoming events');
  }
});

// Get events by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if category exists
    const [categories] = await query('SELECT id, name FROM categories WHERE id = ?', [categoryId]);
    if (categories.length === 0) {
      return ApiResponse.notFound(res, 'Category not found');
    }

    // Get total count
    const [countResult] = await query(
      'SELECT COUNT(*) as total FROM events WHERE category_id = ? AND is_active = 1',
      [categoryId]
    );

    // Get events
    const [events] = await query(
      `SELECT e.*, c.name as category_name,
              (SELECT COUNT(*) FROM registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.category_id = ? AND e.is_active = 1
       ORDER BY e.event_date ASC 
       LIMIT ? OFFSET ?`,
      [categoryId, parseInt(limit), offset]
    );

    const result = {
      category: categories[0],
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      }
    };

    return ApiResponse.success(res, result, 'Events by category retrieved successfully');

  } catch (error) {
    console.error('Get events by category error:', error);
    return ApiResponse.error(res, 'Failed to get events by category');
  }
});

// Search events
router.get('/search/events', async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!q.trim()) {
      return ApiResponse.badRequest(res, 'Search query is required');
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM events e 
       WHERE e.is_active = 1 AND 
             (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );

    // Get events
    const [events] = await query(
      `SELECT e.*, c.name as category_name,
              (SELECT COUNT(*) FROM registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.is_active = 1 AND 
             (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)
       ORDER BY e.event_date ASC 
       LIMIT ? OFFSET ?`,
      [`%${q}%`, `%${q}%`, `%${q}%`, parseInt(limit), offset]
    );

    const result = {
      query: q,
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      }
    };

    return ApiResponse.success(res, result, 'Search results retrieved successfully');

  } catch (error) {
    console.error('Search events error:', error);
    return ApiResponse.error(res, 'Failed to search events');
  }
});

// Cleanup ended events (can be triggered manually or runs automatically)
router.post('/cleanup-ended', authenticateToken, async (req, res) => {
  try {
    const result = await deleteEndedEvents();
    return ApiResponse.success(res, result, `Successfully deleted ${result.deletedCount} ended event(s)`);
  } catch (error) {
    console.error('Cleanup ended events error:', error);
    return ApiResponse.error(res, 'Failed to cleanup ended events');
  }
});

// Get highlighted event for homepage hero section (public)
router.get('/highlighted/event', async (req, res) => {
  try {
    const [events] = await query(
      `SELECT e.*, c.name as category_name, e.image as image_url,
              (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       WHERE e.is_highlighted = 1 
         AND e.is_active = 1 
         AND e.status = 'published'
         AND e.event_date >= CURDATE()
       ORDER BY e.event_date ASC
       LIMIT 1`
    );

    if (events.length === 0) {
      // If no highlighted event, return the nearest upcoming event
      const [fallbackEvents] = await query(
        `SELECT e.*, c.name as category_name, e.image as image_url,
                (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id AND status = 'confirmed') as approved_registrations
         FROM events e 
         LEFT JOIN categories c ON e.category_id = c.id 
         WHERE e.is_active = 1 
           AND e.status = 'published'
           AND e.event_date >= CURDATE()
         ORDER BY e.event_date ASC
         LIMIT 1`
      );
      
      return ApiResponse.success(res, fallbackEvents[0] || null, 'No highlighted event, showing nearest upcoming event');
    }

    return ApiResponse.success(res, events[0], 'Highlighted event retrieved successfully');

  } catch (error) {
    console.error('Get highlighted event error:', error);
    return ApiResponse.error(res, 'Failed to get highlighted event');
  }
});

// Set event as highlighted (admin only) - only one event can be highlighted at a time
router.put('/:id/highlight', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_highlighted } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, 'Only admins can set highlighted events');
    }

    // If setting as highlighted, remove highlight from all other events first
    if (is_highlighted) {
      await query('UPDATE events SET is_highlighted = 0');
    }

    // Update the event
    await query(
      'UPDATE events SET is_highlighted = ?, updated_at = NOW() WHERE id = ?',
      [is_highlighted ? 1 : 0, id]
    );

    return ApiResponse.success(res, null, `Event ${is_highlighted ? 'highlighted' : 'unhighlighted'} successfully`);

  } catch (error) {
    console.error('Set highlighted event error:', error);
    return ApiResponse.error(res, 'Failed to set highlighted event');
  }
});

module.exports = router;
