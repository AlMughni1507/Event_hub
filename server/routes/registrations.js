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

// Check if user is registered for a specific event
router.get('/check/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const [registrations] = await query(
      'SELECT id, status FROM event_registrations WHERE user_id = ? AND event_id = ?',
      [req.user.id, eventId]
    );

    return ApiResponse.success(res, {
      is_registered: registrations.length > 0,
      status: registrations.length > 0 ? registrations[0].status : null,
      registration_id: registrations.length > 0 ? registrations[0].id : null
    }, 'Registration status checked');

  } catch (error) {
    console.error('Check registration error:', error);
    return ApiResponse.error(res, 'Failed to check registration');
  }
});

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
      `SELECT COUNT(*) as total FROM registrations er ${whereClause}`,
      params
    );

    // Get registrations with event info
    const [registrations] = await query(
      `SELECT er.*, 
              e.title as event_title, 
              e.event_date, 
              e.event_time,
              e.location, 
              e.price as registration_fee,
              er.payment_amount,
              er.payment_status,
              at.token as attendance_token,
              c.name as category_name
       FROM registrations er
       LEFT JOIN events e ON er.event_id = e.id
       LEFT JOIN categories c ON e.category_id = c.id
       LEFT JOIN attendance_tokens at ON at.user_id = er.user_id AND at.event_id = er.event_id
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

    const {
      event_id,
      payment_method = 'cash',
      full_name,
      email,
      phone,
      address,
      city,
      province,
      institution,
      notes
    } = req.body;

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
        'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ? AND status = "confirmed"',
        [event_id]
      );

      if (approvedRegistrations[0].count >= event.max_participants) {
        console.log('❌ Event is full');
        return ApiResponse.conflict(res, 'Event is full');
      }
    }

    console.log('✅ Creating registration...');
    const registrantName = (full_name || req.user.full_name || '').trim();
    const registrantEmail = (email || req.user.email || '').trim();
    const registrantPhone = (phone || req.user.phone || '').trim();
    const registrantAddress = address || req.user.address || '';
    const registrantCity = city || req.user.city || '';
    const registrantProvince = province || req.user.province || '';
    const registrantInstitution = institution || req.user.institution || '';

    const isFreeEvent = event.is_free === 1 || parseFloat(event.price || 0) === 0;

    const registrationStatus = isFreeEvent ? 'confirmed' : 'pending';
    const paymentStatus = isFreeEvent ? 'paid' : 'pending';
    const paymentAmount = parseFloat(event.price || 0);

    // Calculate attendance deadline (end of event day + 1 hour buffer)
    const eventEndTime = event.end_time || '23:59:59';
    const eventEndDate = event.end_date || event.event_date;
    const attendanceDeadline = new Date(`${eventEndDate} ${eventEndTime}`);
    attendanceDeadline.setHours(attendanceDeadline.getHours() + 1); // 1 hour after event ends

    // Save to primary registrations table (analytics & user profile)
    let primaryRegistrationId = null;
    try {
      const [primaryInsert] = await query(
        `INSERT INTO registrations 
         (user_id, event_id, full_name, phone, email, address, city, province, institution, payment_method, status, payment_status, payment_amount, attendance_required, attendance_status, attendance_deadline, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 'pending', ?, ?)`,
        [
          req.user.id,
          event_id,
          registrantName,
          registrantPhone,
          registrantEmail,
          registrantAddress,
          registrantCity,
          registrantProvince,
          registrantInstitution,
          payment_method,
          registrationStatus,
          paymentStatus,
          paymentAmount,
          attendanceDeadline,
          notes || ''
        ]
      );
      primaryRegistrationId = primaryInsert.insertId;
      console.log('✅ Registration record stored:', primaryRegistrationId);
    } catch (primaryError) {
      console.warn('⚠️ Failed to insert into registrations table:', primaryError.message);
      // Continue even if legacy table fails
    }

    // Create event registration (main reference for attendance & admin screens)
    const [eventInsert] = await query(
      `INSERT INTO event_registrations
       (user_id, event_id, full_name, phone, email, address, city, province, institution, payment_method, payment_amount, payment_status, status, attendance_required, attendance_status, attendance_deadline, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, 'pending', ?, ?)`,
      [
        req.user.id,
        event_id,
        registrantName,
        registrantPhone,
        registrantEmail,
        registrantAddress,
        registrantCity,
        registrantProvince,
        registrantInstitution,
        payment_method,
        paymentAmount,
        paymentStatus,
        registrationStatus,
        attendanceDeadline,
        notes || ''
      ]
    );

    const eventRegistrationId = eventInsert.insertId;
    console.log('✅ Event registration created:', eventRegistrationId);

    let tokenData = null;

    if (registrationStatus === 'confirmed') {
      // Generate attendance token
      console.log('🔑 Generating token...');
      tokenData = await TokenService.createAttendanceToken(
        eventRegistrationId,
        req.user.id,
        event_id
      );

      console.log('✅ Token generated:', tokenData.token);

      // Send token via email
      try {
        console.log('📧 Sending token email...');
        await TokenService.sendTokenEmail(
          registrantEmail || req.user.email,
          registrantName || req.user.full_name,
          event.title,
          tokenData.token
        );
        console.log('✅ Token email sent');
      } catch (emailError) {
        console.error('❌ Failed to send token email:', emailError);
        // Don't fail registration if email fails
      }
    } else {
      console.log('ℹ️ Registration pending payment - token will be generated after confirmation');
    }

    // Get created registration
    const [registrations] = await query(
      `SELECT r.*, e.title as event_title, e.event_date, e.location, e.price as registration_fee
       FROM event_registrations r
       LEFT JOIN events e ON r.event_id = e.id
       WHERE r.id = ?`,
      [eventRegistrationId]
    );

    console.log('✅ Registration completed successfully');
    return ApiResponse.created(res, {
      ...registrations[0],
      token: tokenData?.token || null,
      tokenExpiresAt: tokenData?.expiresAt || null
    }, registrationStatus === 'confirmed'
      ? 'Registration created successfully. Attendance token has been sent to your email.'
      : 'Registration created successfully. Silakan selesaikan pembayaran untuk menerima token kehadiran.'
    );

  } catch (error) {
    console.error('❌ Create registration error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    
    // Provide more specific error message
    let errorMessage = 'Failed to create registration';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return ApiResponse.error(res, errorMessage, error.message);
  }
});

// Cancel registration
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if registration exists and belongs to user
    const [registrations] = await query(
      'SELECT * FROM registrations WHERE id = ? AND user_id = ?',
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

    if (registration.status === 'confirmed') {
      return ApiResponse.badRequest(res, 'Cannot cancel confirmed registration');
    }

    // Cancel registration
    await query(
      'UPDATE registrations SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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
      `SELECT er.*, e.title as event_title, e.event_date, e.location, e.price as registration_fee,
              c.name as category_name
       FROM registrations er
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

