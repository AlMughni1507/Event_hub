const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = 'all', status = 'all' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    let params = [];
    
    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (role !== 'all') {
      whereClause += ' AND role = ?';
      params.push(role);
    }
    
    if (status !== 'all') {
      whereClause += ' AND is_active = ?';
      params.push(status === 'active' ? 1 : 0);
    }

    const [users] = await query(
      `SELECT id, username, email, full_name, phone, role, avatar, is_active, created_at, updated_at,
       (SELECT COUNT(*) FROM events WHERE organizer_id = users.id) as events_count,
       (SELECT COUNT(*) FROM registrations WHERE user_id = users.id) as registrations_count
       FROM users 
       WHERE ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [totalResult] = await query(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      params
    );

    return ApiResponse.success(res, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResult[0].total,
        totalPages: Math.ceil(totalResult[0].total / limit)
      }
    }, 'Users retrieved successfully');

  } catch (error) {
    console.error('Get users error:', error);
    return ApiResponse.error(res, 'Failed to get users');
  }
});

// Get user by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await query(
      `SELECT id, username, email, full_name, phone, role, avatar, is_active, created_at, updated_at,
       (SELECT COUNT(*) FROM events WHERE organizer_id = users.id) as events_count,
       (SELECT COUNT(*) FROM registrations WHERE user_id = users.id) as registrations_count
       FROM users WHERE id = ?`,
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

// Create new user (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, full_name, phone, role = 'user' } = req.body;

    // Validate required fields
    if (!username || !email || !password || !full_name) {
      return ApiResponse.error(res, 'Username, email, password, and full name are required', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await query(
      'INSERT INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, phone || null, role]
    );

    const [newUser] = await query(
      'SELECT id, username, email, full_name, phone, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return ApiResponse.success(res, newUser[0], 'User created successfully', 201);

  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return ApiResponse.error(res, 'Username or email already exists', 400);
    }
    return ApiResponse.error(res, 'Failed to create user');
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, phone, role, is_active, password } = req.body;

    const [existing] = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    let updateFields = [];
    let updateValues = [];

    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const [updatedUser] = await query(
      'SELECT id, username, email, full_name, phone, role, avatar, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    return ApiResponse.success(res, updatedUser[0], 'User updated successfully');

  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return ApiResponse.error(res, 'Username or email already exists', 400);
    }
    return ApiResponse.error(res, 'Failed to update user');
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Check if user has events or registrations
    const [events] = await query('SELECT COUNT(*) as count FROM events WHERE organizer_id = ?', [id]);
    const [registrations] = await query('SELECT COUNT(*) as count FROM registrations WHERE user_id = ?', [id]);
    
    if (events[0].count > 0 || registrations[0].count > 0) {
      return ApiResponse.error(res, 'Cannot delete user with existing events or registrations', 400);
    }

    await query('DELETE FROM users WHERE id = ?', [id]);

    return ApiResponse.success(res, null, 'User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    return ApiResponse.error(res, 'Failed to delete user');
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [stats] = await query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'organizer' THEN 1 ELSE 0 END) as organizer_count,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_users,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_registrations,
        SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as week_registrations
      FROM users
    `);

    return ApiResponse.success(res, stats[0], 'User statistics retrieved successfully');

  } catch (error) {
    console.error('Get user stats error:', error);
    return ApiResponse.error(res, 'Failed to get user statistics');
  }
});

module.exports = router;
