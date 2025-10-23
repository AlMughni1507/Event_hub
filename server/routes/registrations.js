const express = require('express');
const { query } = require('../db');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validateRegistration, handleValidationErrors } = require('../middleware/validation');
const ApiResponse = require('../middleware/response');
const TokenService = require('../services/tokenService');

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
    console.log('🚀 Registration request:', req.body);
    console.log('👤 User:', req.user);

    const { event_id, payment_method = 'cash' } = req.body;

    // Check if event exists and is active
    const [events] = await query(
      'SELECT * FROM events WHERE id = ? AND is_active = 1',
      [event_id]
    );

    if (events.length === 0) {
      console.log('❌ Event not found:', event_id);
      return ApiResponse.notFound(res, 'Event not found or inactive');
    }

    const event = events[0];
    console.log('✅ Event found:', event.title);

    // Check if event registration is still open (event hasn't started yet)
    const now = new Date();
    const eventDateTime = new Date(`${event.event_date} ${event.event_time}`);
    
    console.log('🕐 Current time:', now.toISOString());
    console.log('🕐 Event time:', eventDateTime.toISOString());
    console.log('🕐 Event date:', event.event_date);
    console.log('🕐 Event time:', event.event_time);
    
    // Add some buffer time (1 hour) before closing registration
    const registrationCloseTime = new Date(eventDateTime.getTime() - (60 * 60 * 1000)); // 1 hour before event
    
    if (now >= registrationCloseTime) {
      console.log('❌ Registration closed - too close to event time');
      return ApiResponse.badRequest(res, 'Pendaftaran sudah ditutup. Event akan dimulai kurang dari 1 jam lagi');
    }

    // Check if user already registered
    const [existingRegistrations] = await query(
      'SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?',
      [req.user.id, event_id]
    );

    if (existingRegistrations.length > 0) {
      console.log('❌ User already registered');
      return ApiResponse.conflict(res, 'You have already registered for this event');
    }

    // Check if event is full
    if (event.max_participants) {
      const [approvedRegistrations] = await query(
        'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ? AND status = "approved"',
        [event_id]
      );

      if (approvedRegistrations[0].count >= event.max_participants) {
        console.log('❌ Event is full');
        return ApiResponse.conflict(res, 'Event is full');
      }
    }

    console.log('✅ Creating registration...');
    // Create registration
    const [result] = await query(
      'INSERT INTO event_registrations (user_id, event_id, payment_method, status) VALUES (?, ?, ?, "approved")',
      [req.user.id, event_id, payment_method]
    );

    console.log('✅ Registration created:', result.insertId);

    // Generate attendance token
    console.log('🔑 Generating token...');
    const tokenData = await TokenService.createAttendanceToken(
      result.insertId,
      req.user.id,
      event_id
    );

    console.log('✅ Token generated:', tokenData.token);

    // Send token via email
    try {
      console.log('📧 Sending token email...');
      await TokenService.sendTokenEmail(
        req.user.email,
        req.user.full_name,
        event.title,
        tokenData.token
      );
      console.log('✅ Token email sent');
    } catch (emailError) {
      console.error('❌ Failed to send token email:', emailError);
      // Don't fail registration if email fails
    }

    // Get created registration
    const [registrations] = await query(
      `SELECT er.*, e.title as event_title, e.event_date, e.location, e.registration_fee
       FROM event_registrations er
       LEFT JOIN events e ON er.event_id = e.id
       WHERE er.id = ?`,
      [result.insertId]
    );

    console.log('✅ Registration completed successfully');
    return ApiResponse.created(res, {
      ...registrations[0],
      token: tokenData.token,
      tokenExpiresAt: tokenData.expiresAt
    }, 'Registration created successfully. Attendance token has been sent to your email.');

  } catch (error) {
    console.error('❌ Create registration error:', error);
    console.error('❌ Error stack:', error.stack);
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

// Test token generation
router.post('/test-token', async (req, res) => {
  try {
    console.log('🧪 Testing token generation...');
    
    // Generate test token
    const tokenData = await TokenService.createAttendanceToken(
      999, // fake registration ID
      req.user.id,
      req.body.event_id || 1
    );

    console.log('✅ Test token generated:', tokenData.token);

    return ApiResponse.success(res, {
      token: tokenData.token,
      expiresAt: tokenData.expiresAt
    }, 'Test token generated successfully');

  } catch (error) {
    console.error('❌ Test token error:', error);
    return ApiResponse.error(res, 'Failed to generate test token');
  }
});

module.exports = router;

