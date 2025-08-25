const express = require('express');
const { query } = require('../db');
const { authenticateToken, authorizeRoles, authorizeEventAccess } = require('../middleware/auth');
const { validateEventCreation, validateEventUpdate, validatePagination } = require('../middleware/validation');
const ApiResponse = require('../utils/response');

const router = express.Router();

// Get all events with pagination and filters
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const {
      category_id,
      status = 'published',
      city,
      province,
      search,
      featured,
      free,
      date_from,
      date_to
    } = req.query;

    // Build WHERE clause
    let whereConditions = ['1=1'];
    let params = [];

    if (category_id) {
      whereConditions.push('e.category_id = ?');
      params.push(category_id);
    }

    if (status) {
      whereConditions.push('e.status = ?');
      params.push(status);
    }

    if (city) {
      whereConditions.push('e.city LIKE ?');
      params.push(`%${city}%`);
    }

    if (province) {
      whereConditions.push('e.province LIKE ?');
      params.push(`%${province}%`);
    }

    if (search) {
      whereConditions.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      whereConditions.push('e.is_featured = 1');
    }

    if (free === 'true') {
      whereConditions.push('e.is_free = 1');
    }

    if (date_from) {
      whereConditions.push('e.event_date >= ?');
      params.push(date_from);
    }

    if (date_to) {
      whereConditions.push('e.event_date <= ?');
      params.push(date_to);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM events e WHERE ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get events with organizer and category info
    const [events] = await query(
      `SELECT 
        e.*,
        u.full_name as organizer_name,
        u.username as organizer_username,
        c.name as category_name,
        c.color as category_color,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') as registered_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return ApiResponse.paginated(res, events, page, limit, total, 'Events retrieved successfully');

  } catch (error) {
    console.error('Get events error:', error);
    return ApiResponse.error(res, 'Failed to get events');
  }
});

// Get featured events
router.get('/featured', async (req, res) => {
  try {
    const [events] = await query(
      `SELECT 
        e.*,
        u.full_name as organizer_name,
        u.username as organizer_username,
        c.name as category_name,
        c.color as category_color,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') as registered_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.is_featured = 1 AND e.status = 'published'
      ORDER BY e.event_date ASC
      LIMIT 6`
    );

    return ApiResponse.success(res, events, 'Featured events retrieved successfully');

  } catch (error) {
    console.error('Get featured events error:', error);
    return ApiResponse.error(res, 'Failed to get featured events');
  }
});

// Get events by organizer
router.get('/organizer/my-events', authenticateToken, authorizeRoles('admin', 'organizer'), validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await query(
      'SELECT COUNT(*) as total FROM events WHERE organizer_id = ?',
      [req.user.id]
    );

    const total = countResult[0].total;

    // Get events
    const [events] = await query(
      `SELECT 
        e.*,
        c.name as category_name,
        c.color as category_color,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') as registered_count
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.organizer_id = ?
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );

    return ApiResponse.paginated(res, events, page, limit, total, 'Your events retrieved successfully');

  } catch (error) {
    console.error('Get organizer events error:', error);
    return ApiResponse.error(res, 'Failed to get your events');
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;

    const [events] = await query(
      `SELECT 
        e.*,
        u.full_name as organizer_name,
        u.username as organizer_username,
        u.email as organizer_email,
        u.phone as organizer_phone,
        c.name as category_name,
        c.color as category_color,
        c.description as category_description,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') as registered_count
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?`,
      [eventId]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    const event = events[0];

    // Get reviews for this event
    const [reviews] = await query(
      `SELECT 
        r.*,
        u.full_name as reviewer_name,
        u.username as reviewer_username
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.created_at DESC`,
      [eventId]
    );

    event.reviews = reviews;

    return ApiResponse.success(res, event, 'Event retrieved successfully');

  } catch (error) {
    console.error('Get event error:', error);
    return ApiResponse.error(res, 'Failed to get event');
  }
});

// Create new event (organizer/admin only)
router.post('/', authenticateToken, authorizeRoles('admin', 'organizer'), validateEventCreation, async (req, res) => {
  try {
    const {
      title,
      description,
      short_description,
      category_id,
      event_date,
      event_time,
      end_date,
      end_time,
      location,
      address,
      city,
      province,
      postal_code,
      latitude,
      longitude,
      max_participants,
      price,
      registration_deadline
    } = req.body;

    // Set organizer_id to current user
    const organizer_id = req.user.id;

    // Calculate is_free based on price
    const is_free = !price || parseFloat(price) === 0;

    const [result] = await query(
      `INSERT INTO events (
        title, description, short_description, category_id, organizer_id,
        event_date, event_time, end_date, end_time, location, address,
        city, province, postal_code, latitude, longitude, max_participants,
        price, is_free, registration_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, short_description, category_id, organizer_id,
        event_date, event_time, end_date, end_time, location, address,
        city, province, postal_code, latitude, longitude, max_participants,
        price, is_free, registration_deadline
      ]
    );

    // Get created event
    const [newEvent] = await query(
      'SELECT * FROM events WHERE id = ?',
      [result.insertId]
    );

    return ApiResponse.created(res, newEvent[0], 'Event created successfully');

  } catch (error) {
    console.error('Create event error:', error);
    return ApiResponse.error(res, 'Failed to create event');
  }
});

// Update event (organizer/admin only)
router.put('/:id', authenticateToken, authorizeEventAccess, validateEventUpdate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.organizer_id;
    delete updateData.created_at;

    // Calculate is_free if price is being updated
    if (updateData.price !== undefined) {
      updateData.is_free = !updateData.price || parseFloat(updateData.price) === 0;
    }

    // Build update query dynamically
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      return ApiResponse.badRequest(res, 'No fields to update');
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE events SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await query(query, [...values, eventId]);

    // Get updated event
    const [updatedEvent] = await query(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );

    if (updatedEvent.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    return ApiResponse.success(res, updatedEvent[0], 'Event updated successfully');

  } catch (error) {
    console.error('Update event error:', error);
    return ApiResponse.error(res, 'Failed to update event');
  }
});

// Delete event (organizer/admin only)
router.delete('/:id', authenticateToken, authorizeEventAccess, async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if event has registrations
    const [registrations] = await query(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ?',
      [eventId]
    );

    if (registrations[0].count > 0) {
      return ApiResponse.conflict(res, 'Cannot delete event with existing registrations');
    }

    // Delete event
    await query('DELETE FROM events WHERE id = ?', [eventId]);

    return ApiResponse.success(res, null, 'Event deleted successfully');

  } catch (error) {
    console.error('Delete event error:', error);
    return ApiResponse.error(res, 'Failed to delete event');
  }
});

module.exports = router;
