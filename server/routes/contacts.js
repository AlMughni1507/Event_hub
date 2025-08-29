const express = require('express');
const router = express.Router();
const { query } = require('../db');
const ApiResponse = require('../middleware/response');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return ApiResponse.badRequest(res, 'Name, email, subject, and message are required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ApiResponse.badRequest(res, 'Invalid email format');
    }

    const [result] = await query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );

    return ApiResponse.created(res, 
      { contact_id: result.insertId }, 
      'Your message has been sent successfully. We will get back to you soon!'
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return ApiResponse.error(res, 'Failed to send message');
  }
});

// Get all contacts (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      queryParams.push(status);
    }

    const [contacts] = await query(`
      SELECT 
        c.*, 
        u.full_name as replied_by_name
      FROM contacts c
      LEFT JOIN users u ON c.replied_by = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    const [countResult] = await query(`
      SELECT COUNT(*) as total FROM contacts ${whereClause}
    `, queryParams);

    const total = countResult[0].total;

    return ApiResponse.success(res, {
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    return ApiResponse.error(res, 'Failed to fetch contacts');
  }
});

// Update contact status (Admin only)
router.patch('/:id/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!['new', 'read', 'replied', 'closed'].includes(status)) {
      return ApiResponse.badRequest(res, 'Invalid status');
    }

    const updateData = { status };
    const queryParams = [status];

    if (status === 'replied') {
      updateData.replied_at = new Date();
      updateData.replied_by = userId;
      queryParams.push(new Date(), userId, id);
      
      await query(
        'UPDATE contacts SET status = ?, replied_at = ?, replied_by = ? WHERE id = ?',
        queryParams
      );
    } else {
      queryParams.push(id);
      await query('UPDATE contacts SET status = ? WHERE id = ?', queryParams);
    }

    return ApiResponse.success(res, null, 'Contact status updated successfully');

  } catch (error) {
    console.error('Update contact status error:', error);
    return ApiResponse.error(res, 'Failed to update contact status');
  }
});

// Get contact by ID (Admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const [contacts] = await query(`
      SELECT 
        c.*, 
        u.full_name as replied_by_name
      FROM contacts c
      LEFT JOIN users u ON c.replied_by = u.id
      WHERE c.id = ?
    `, [id]);

    if (contacts.length === 0) {
      return ApiResponse.notFound(res, 'Contact not found');
    }

    // Mark as read if it's new
    if (contacts[0].status === 'new') {
      await query('UPDATE contacts SET status = "read" WHERE id = ?', [id]);
      contacts[0].status = 'read';
    }

    return ApiResponse.success(res, contacts[0]);

  } catch (error) {
    console.error('Get contact error:', error);
    return ApiResponse.error(res, 'Failed to fetch contact');
  }
});

module.exports = router;
