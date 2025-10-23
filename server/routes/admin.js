const express = require('express');
const { query } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const ApiResponse = require('../middleware/response');
const XLSX = require('xlsx');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get total users
    const [userStats] = await query('SELECT COUNT(*) as total FROM users WHERE role = "user"');
    
    // Get total events
    const [eventStats] = await query('SELECT COUNT(*) as total FROM events');
    
    // Get total registrations
    const [registrationStats] = await query('SELECT COUNT(*) as total FROM event_registrations');
    
    // Get recent events
    const [recentEvents] = await query(`
      SELECT e.*, c.name as category_name 
      FROM events e 
      LEFT JOIN categories c ON e.category_id = c.id 
      ORDER BY e.created_at DESC 
      LIMIT 5
    `);
    
    // Get recent registrations
    const [recentRegistrations] = await query(`
      SELECT r.*, e.title as event_title, u.full_name as user_name
      FROM event_registrations r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    const stats = {
      total_users: userStats[0].total,
      total_events: eventStats[0].total,
      total_registrations: registrationStats[0].total,
      recent_events: recentEvents,
      recent_registrations: recentRegistrations
    };

    return ApiResponse.success(res, stats, 'Dashboard statistics retrieved successfully');

  } catch (error) {
    console.error('Dashboard error:', error);
    return ApiResponse.error(res, 'Failed to get dashboard statistics');
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    // Get users
    const [users] = await query(
      `SELECT id, username, email, full_name, phone, role, is_active, created_at, updated_at 
       FROM users ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const result = {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      }
    };

    return ApiResponse.success(res, result, 'Users retrieved successfully');

  } catch (error) {
    console.error('Get users error:', error);
    return ApiResponse.error(res, 'Failed to get users');
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await query(
      'SELECT id, username, email, full_name, phone, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    return ApiResponse.success(res, users[0], 'User retrieved successfully');

  } catch (error) {
    console.error('Get user error:', error);
    return ApiResponse.error(res, 'Failed to get user');
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, role, is_active } = req.body;

    // Check if user exists
    const [existingUsers] = await query('SELECT id FROM users WHERE id = ?', [id]);
    
    if (existingUsers.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Validate role
    if (role && !['admin', 'user'].includes(role)) {
      return ApiResponse.badRequest(res, 'Invalid role');
    }

    // Update user
    await query(
      'UPDATE users SET full_name = ?, phone = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, phone, role, is_active, id]
    );

    // Get updated user
    const [users] = await query(
      'SELECT id, username, email, full_name, phone, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    return ApiResponse.success(res, users[0], 'User updated successfully');

  } catch (error) {
    console.error('Update user error:', error);
    return ApiResponse.error(res, 'Failed to update user');
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUsers] = await query('SELECT id, role FROM users WHERE id = ?', [id]);
    
    if (existingUsers.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Prevent deleting admin users
    if (existingUsers[0].role === 'admin') {
      return ApiResponse.forbidden(res, 'Cannot delete admin users');
    }

    // Delete user registrations first
    await query('DELETE FROM event_registrations WHERE user_id = ?', [id]);
    
    // Delete user
    await query('DELETE FROM users WHERE id = ?', [id]);

    return ApiResponse.success(res, null, 'User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    return ApiResponse.error(res, 'Failed to delete user');
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category_id = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category_id) {
      whereClause += ' AND e.category_id = ?';
      params.push(category_id);
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM events e ${whereClause}`,
      params
    );

    // Get events with category info
    const [events] = await query(
      `SELECT e.*, c.name as category_name, 
              (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as registration_count
       FROM events e 
       LEFT JOIN categories c ON e.category_id = c.id 
       ${whereClause}
       ORDER BY e.created_at DESC 
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

// Get all registrations
router.get('/registrations', async (req, res) => {
  try {
    const { page = 1, limit = 10, event_id = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (event_id) {
      whereClause += ' AND r.event_id = ?';
      params.push(event_id);
    }

    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM event_registrations r ${whereClause}`,
      params
    );

    // Get registrations with event and user info
    const [registrations] = await query(
      `SELECT r.*, e.title as event_title, e.event_date, e.location,
              u.full_name as user_name, u.email as user_email
       FROM event_registrations r
       LEFT JOIN events e ON r.event_id = e.id
       LEFT JOIN users u ON r.user_id = u.id
       ${whereClause}
       ORDER BY r.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const result = {
      registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      }
    };

    return ApiResponse.success(res, result, 'Registrations retrieved successfully');

  } catch (error) {
    console.error('Get registrations error:', error);
    return ApiResponse.error(res, 'Failed to get registrations');
  }
});

// Update registration status
router.put('/registrations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return ApiResponse.badRequest(res, 'Invalid status');
    }

    // Check if registration exists
    const [existingRegistrations] = await query(
      'SELECT id FROM event_registrations WHERE id = ?',
      [id]
    );

    if (existingRegistrations.length === 0) {
      return ApiResponse.notFound(res, 'Registration not found');
    }

    // Update status
    await query(
      'UPDATE event_registrations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    return ApiResponse.success(res, null, 'Registration status updated successfully');

  } catch (error) {
    console.error('Update registration status error:', error);
    return ApiResponse.error(res, 'Failed to update registration status');
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const { page, limit, search = '' } = req.query;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM categories ${whereClause}`,
      params
    );

    // Get categories with event count - show all by default, paginate only if requested
    let categoriesQuery = `SELECT c.*, 
              (SELECT COUNT(*) FROM events WHERE category_id = c.id) as event_count
       FROM categories c 
       ${whereClause}
       ORDER BY c.name ASC`;
    
    let queryParams = [...params];
    
    if (page && limit) {
      const offset = (page - 1) * limit;
      categoriesQuery += ' LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));
    }

    const [categories] = await query(categoriesQuery, queryParams);

    const result = { categories };
    
    // Only include pagination if requested
    if (page && limit) {
      result.pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      };
    }

    return ApiResponse.success(res, result, 'Categories retrieved successfully');

  } catch (error) {
    console.error('Get categories error:', error);
    return ApiResponse.error(res, 'Failed to get categories');
  }
});

// Get system statistics
router.get('/statistics', async (req, res) => {
  try {
    // User statistics
    const [userStats] = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
        COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactive_users
      FROM users
    `);

    // Event statistics
    const [eventStats] = await query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN event_date > NOW() THEN 1 END) as upcoming_events,
        COUNT(CASE WHEN event_date <= NOW() THEN 1 END) as past_events
      FROM events
    `);

    // Registration statistics
    const [registrationStats] = await query(`
      SELECT 
        COUNT(*) as total_registrations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_registrations,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_registrations,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_registrations
      FROM event_registrations
    `);

    const statistics = {
      users: userStats[0],
      events: eventStats[0],
      registrations: registrationStats[0]
    };

    return ApiResponse.success(res, statistics, 'Statistics retrieved successfully');

  } catch (error) {
    console.error('Get statistics error:', error);
    return ApiResponse.error(res, 'Failed to get statistics');
  }
});

// Export participants data to Excel/CSV
router.get('/export/participants/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { format = 'xlsx' } = req.query; // xlsx or csv

    // Get event info
    const [events] = await query(
      'SELECT title, event_date FROM events WHERE id = ?',
      [eventId]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    // Get participants data
    const [participants] = await query(`
      SELECT 
        er.id,
        u.full_name,
        u.email,
        u.phone,
        er.status,
        er.registration_date,
        er.attendance_status,
        er.payment_status,
        er.created_at
      FROM event_registrations er
      LEFT JOIN users u ON er.user_id = u.id
      WHERE er.event_id = ?
      ORDER BY er.created_at DESC
    `, [eventId]);

    // Prepare data for export
    const exportData = participants.map((participant, index) => ({
      'No': index + 1,
      'Nama Lengkap': participant.full_name,
      'Email': participant.email,
      'No. Telepon': participant.phone,
      'Status Pendaftaran': participant.status,
      'Status Kehadiran': participant.attendance_status || 'Belum Hadir',
      'Status Pembayaran': participant.payment_status || 'Belum Dibayar',
      'Tanggal Daftar': new Date(participant.created_at).toLocaleDateString('id-ID'),
      'Waktu Daftar': new Date(participant.created_at).toLocaleTimeString('id-ID')
    }));

    if (format === 'csv') {
      // CSV export
      const csvHeaders = Object.keys(exportData[0] || {}).join(',');
      const csvRows = exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
      const csvContent = [csvHeaders, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="peserta_${events[0].title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csvContent);
    } else {
      // Excel export
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Peserta Event');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="peserta_${events[0].title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`);
      return res.send(buffer);
    }

  } catch (error) {
    console.error('Export participants error:', error);
    return ApiResponse.error(res, 'Failed to export participants data');
  }
});

// Export all events data
router.get('/export/events', async (req, res) => {
  try {
    const { format = 'xlsx' } = req.query;

    // Get events data
    const [events] = await query(`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.event_date,
        e.event_time,
        e.location,
        e.max_participants,
        e.price,
        e.is_free,
        e.status,
        c.name as category_name,
        (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as total_registrations,
        (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id AND status = 'confirmed') as confirmed_registrations,
        e.created_at
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      ORDER BY e.event_date ASC
    `);

    // Prepare data for export
    const exportData = events.map((event, index) => ({
      'No': index + 1,
      'Judul Event': event.title,
      'Deskripsi': event.description,
      'Tanggal': new Date(event.event_date).toLocaleDateString('id-ID'),
      'Waktu': event.event_time,
      'Lokasi': event.location,
      'Kategori': event.category_name,
      'Max Peserta': event.max_participants,
      'Harga': event.is_free ? 'Gratis' : `Rp ${new Intl.NumberFormat('id-ID').format(event.price)}`,
      'Status': event.status,
      'Total Pendaftar': event.total_registrations,
      'Pendaftar Terkonfirmasi': event.confirmed_registrations,
      'Tanggal Dibuat': new Date(event.created_at).toLocaleDateString('id-ID')
    }));

    if (format === 'csv') {
      const csvHeaders = Object.keys(exportData[0] || {}).join(',');
      const csvRows = exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
      const csvContent = [csvHeaders, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="data_event_${new Date().toISOString().split('T')[0]}.csv"`);
      return res.send(csvContent);
    } else {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Event');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="data_event_${new Date().toISOString().split('T')[0]}.xlsx"`);
      return res.send(buffer);
    }

  } catch (error) {
    console.error('Export events error:', error);
    return ApiResponse.error(res, 'Failed to export events data');
  }
});

module.exports = router;
