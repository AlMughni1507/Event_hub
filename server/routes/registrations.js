const express = require('express');
const { query } = require('../db');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validateRegistration, handleValidationErrors } = require('../middleware/validation');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);
router.use(requireUser);

// Get user's registrations
router.get('/my-registrations', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE er.user_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND er.status = ?';
      params.push(status);
    }

    // Get total count
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM event_registrations er ${whereClause}`,
      params
    );

    // Get registrations with event info
    const [registrations] = await query(
      `SELECT er.*, e.title as event_title, e.event_date, e.location, e.registration_fee,
              c.name as category_name
       FROM event_registrations er
       LEFT JOIN events e ON er.event_id = e.id
       LEFT JOIN categories c ON e.category_id = c.id
       ${whereClause}
       ORDER BY er.created_at DESC 
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

// Register for an event
router.post('/', validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { event_id, payment_method = 'cash' } = req.body;

    // Check if event exists and is active
    const [events] = await query(
      'SELECT * FROM events WHERE id = ? AND is_active = 1',
      [event_id]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found or inactive');
    }

    const event = events[0];

    // Check if event is in the future
    if (new Date(event.event_date) <= new Date()) {
      return ApiResponse.badRequest(res, 'Cannot register for past events');
    }

    // Check if user already registered
    const [existingRegistrations] = await query(
      'SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?',
      [req.user.id, event_id]
    );

    if (existingRegistrations.length > 0) {
      return ApiResponse.conflict(res, 'You have already registered for this event');
    }

    // Check if event is full
    if (event.max_participants) {
      const [approvedRegistrations] = await query(
        'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ? AND status = "approved"',
        [event_id]
      );

      if (approvedRegistrations[0].count >= event.max_participants) {
        return ApiResponse.conflict(res, 'Event is full');
      }
    }

    // Create registration
    const [result] = await query(
      'INSERT INTO event_registrations (user_id, event_id, payment_method, status) VALUES (?, ?, ?, "pending")',
      [req.user.id, event_id, payment_method]
    );

    // Get created registration
    const [registrations] = await query(
      `SELECT er.*, e.title as event_title, e.event_date, e.location, e.registration_fee
       FROM event_registrations er
       LEFT JOIN events e ON er.event_id = e.id
       WHERE er.id = ?`,
      [result.insertId]
    );

    return ApiResponse.created(res, registrations[0], 'Registration created successfully');

  } catch (error) {
    console.error('Create registration error:', error);
    return ApiResponse.error(res, 'Failed to create registration');
  }
});

// Cancel registration
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if registration exists and belongs to user
    const [registrations] = await query(
      'SELECT * FROM event_registrations WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (registrations.length === 0) {
      return ApiResponse.notFound(res, 'Registration not found');
    }

    const registration = registrations[0];

    // Check if registration can be cancelled
    if (registration.status === 'cancelled') {
      return ApiResponse.badRequest(res, 'Registration is already cancelled');
    }

    if (registration.status === 'approved') {
      return ApiResponse.badRequest(res, 'Cannot cancel approved registration');
    }

    // Cancel registration
    await query(
      'UPDATE event_registrations SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    return ApiResponse.success(res, null, 'Registration cancelled successfully');

  } catch (error) {
    console.error('Cancel registration error:', error);
    return ApiResponse.error(res, 'Failed to cancel registration');
  }
});

// Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [registrations] = await query(
      `SELECT er.*, e.title as event_title, e.event_date, e.location, e.registration_fee,
              c.name as category_name
       FROM event_registrations er
       LEFT JOIN events e ON er.event_id = e.id
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE er.id = ? AND er.user_id = ?`,
      [id, req.user.id]
    );

    if (registrations.length === 0) {
      return ApiResponse.notFound(res, 'Registration not found');
    }

    return ApiResponse.success(res, registrations[0], 'Registration retrieved successfully');

  } catch (error) {
    console.error('Get registration error:', error);
    return ApiResponse.error(res, 'Failed to get registration');
  }
});

module.exports = router;
