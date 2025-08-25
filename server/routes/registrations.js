const express = require('express');
const { query } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRegistration, validatePagination } = require('../middleware/validation');
const ApiResponse = require('../utils/response');

const router = express.Router();

// Register for an event
router.post('/', authenticateToken, validateRegistration, async (req, res) => {
  try {
    const { event_id, notes } = req.body;
    const user_id = req.user.id;

    // Check if event exists and is published
    const [events] = await query(
      'SELECT * FROM events WHERE id = ? AND status = "published"',
      [event_id]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found or not published');
    }

    const event = events[0];

    // Check if registration deadline has passed
    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return ApiResponse.badRequest(res, 'Registration deadline has passed');
    }

    // Check if event is full
    if (event.max_participants && event.current_participants >= event.max_participants) {
      return ApiResponse.badRequest(res, 'Event is full');
    }

    // Check if user is already registered
    const [existingRegistrations] = await query(
      'SELECT id FROM registrations WHERE event_id = ? AND user_id = ?',
      [event_id, user_id]
    );

    if (existingRegistrations.length > 0) {
      return ApiResponse.conflict(res, 'You are already registered for this event');
    }

    // Create registration
    const [result] = await query(
      'INSERT INTO registrations (event_id, user_id, notes) VALUES (?, ?, ?)',
      [event_id, user_id, notes]
    );

    // Update event participant count
    await query(
      'UPDATE events SET current_participants = current_participants + 1 WHERE id = ?',
      [event_id]
    );

    // Get created registration with event details
    const [registrations] = await query(
      `SELECT 
        r.*,
        e.title as event_title,
        e.event_date,
        e.event_time,
        e.location,
        e.price,
        e.is_free
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      WHERE r.id = ?`,
      [result.insertId]
    );

    return ApiResponse.created(res, registrations[0], 'Registration successful');

  } catch (error) {
    console.error('Registration error:', error);
    return ApiResponse.error(res, 'Failed to register for event');
  }
});

// Get user's registrations
router.get('/my-registrations', authenticateToken, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await query(
      'SELECT COUNT(*) as total FROM registrations WHERE user_id = ?',
      [req.user.id]
    );

    const total = countResult[0].total;

    // Get registrations with event details
    const [registrations] = await query(
      `SELECT 
        r.*,
        e.title as event_title,
        e.event_date,
        e.event_time,
        e.location,
        e.price,
        e.is_free,
        e.status as event_status,
        u.full_name as organizer_name
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE r.user_id = ?
      ORDER BY r.registration_date DESC
      LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );

    return ApiResponse.paginated(res, registrations, page, limit, total, 'Your registrations retrieved successfully');

  } catch (error) {
    console.error('Get user registrations error:', error);
    return ApiResponse.error(res, 'Failed to get your registrations');
  }
});

// Get registrations for an event (organizer/admin only)
router.get('/event/:eventId', authenticateToken, authorizeRoles('admin', 'organizer'), validatePagination, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Check if user is the organizer of this event or admin
    const [events] = await query(
      'SELECT organizer_id FROM events WHERE id = ?',
      [eventId]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    if (req.user.role !== 'admin' && req.user.id !== events[0].organizer_id) {
      return ApiResponse.forbidden(res, 'Access denied to this event');
    }

    // Get total count
    const [countResult] = await query(
      'SELECT COUNT(*) as total FROM registrations WHERE event_id = ?',
      [eventId]
    );

    const total = countResult[0].total;

    // Get registrations with user details
    const [registrations] = await query(
      `SELECT 
        r.*,
        u.full_name,
        u.username,
        u.email,
        u.phone
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.registration_date DESC
      LIMIT ? OFFSET ?`,
      [eventId, limit, offset]
    );

    return ApiResponse.paginated(res, registrations, page, limit, total, 'Event registrations retrieved successfully');

  } catch (error) {
    console.error('Get event registrations error:', error);
    return ApiResponse.error(res, 'Failed to get event registrations');
  }
});

// Update registration status (organizer/admin only)
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'organizer'), async (req, res) => {
  try {
    const registrationId = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'attended'].includes(status)) {
      return ApiResponse.badRequest(res, 'Valid status is required');
    }

    // Get registration with event details
    const [registrations] = await query(
      `SELECT 
        r.*,
        e.organizer_id,
        e.title as event_title
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      WHERE r.id = ?`,
      [registrationId]
    );

    if (registrations.length === 0) {
      return ApiResponse.notFound(res, 'Registration not found');
    }

    const registration = registrations[0];

    // Check if user is the organizer of this event or admin
    if (req.user.role !== 'admin' && req.user.id !== registration.organizer_id) {
      return ApiResponse.forbidden(res, 'Access denied to this registration');
    }

    // Update registration status
    await query(
      'UPDATE registrations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, registrationId]
    );

    // Get updated registration
    const [updatedRegistration] = await query(
      `SELECT 
        r.*,
        u.full_name,
        u.username,
        u.email,
        e.title as event_title
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN events e ON r.event_id = e.id
      WHERE r.id = ?`,
      [registrationId]
    );

    return ApiResponse.success(res, updatedRegistration[0], 'Registration status updated successfully');

  } catch (error) {
    console.error('Update registration status error:', error);
    return ApiResponse.error(res, 'Failed to update registration status');
  }
});

// Cancel registration (user can cancel their own registration)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const registrationId = req.params.id;

    // Get registration
    const [registrations] = await query(
      'SELECT * FROM registrations WHERE id = ?',
      [registrationId]
    );

    if (registrations.length === 0) {
      return ApiResponse.notFound(res, 'Registration not found');
    }

    const registration = registrations[0];

    // Check if user owns this registration or is admin/organizer
    if (req.user.id !== registration.user_id && req.user.role !== 'admin' && req.user.role !== 'organizer') {
      return ApiResponse.forbidden(res, 'Access denied to this registration');
    }

    // Check if registration can be cancelled
    if (registration.status === 'cancelled') {
      return ApiResponse.badRequest(res, 'Registration is already cancelled');
    }

    if (registration.status === 'attended') {
      return ApiResponse.badRequest(res, 'Cannot cancel attended registration');
    }

    // Cancel registration
    await query(
      'UPDATE registrations SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [registrationId]
    );

    // Decrease event participant count if status was confirmed
    if (registration.status === 'confirmed') {
      await query(
        'UPDATE events SET current_participants = current_participants - 1 WHERE id = ?',
        [registration.event_id]
      );
    }

    return ApiResponse.success(res, null, 'Registration cancelled successfully');

  } catch (error) {
    console.error('Cancel registration error:', error);
    return ApiResponse.error(res, 'Failed to cancel registration');
  }
});

// Get registration by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const registrationId = req.params.id;

    const [registrations] = await query(
      `SELECT 
        r.*,
        e.title as event_title,
        e.event_date,
        e.event_time,
        e.location,
        e.price,
        e.is_free,
        u.full_name as user_name,
        u.username as user_username,
        u.email as user_email
      FROM registrations r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?`,
      [registrationId]
    );

    if (registrations.length === 0) {
      return ApiResponse.notFound(res, 'Registration not found');
    }

    const registration = registrations[0];

    // Check if user has access to this registration
    if (req.user.id !== registration.user_id && req.user.role !== 'admin' && req.user.role !== 'organizer') {
      return ApiResponse.forbidden(res, 'Access denied to this registration');
    }

    return ApiResponse.success(res, registration, 'Registration retrieved successfully');

  } catch (error) {
    console.error('Get registration error:', error);
    return ApiResponse.error(res, 'Failed to get registration');
  }
});

module.exports = router;
