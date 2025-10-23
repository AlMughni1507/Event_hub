const express = require('express');
const { query } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const ApiResponse = require('../middleware/response');
const TokenService = require('../services/tokenService');

const router = express.Router();

// Check if attendance is available for an event
router.get('/check/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const [events] = await query(
      'SELECT event_date, event_time, title FROM events WHERE id = ?',
      [eventId]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    const event = events[0];
    const now = new Date();
    const eventDateTime = new Date(`${event.event_date} ${event.event_time}`);
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const isEventDay = eventDate.getTime() === today.getTime();
    const attendanceStartTime = new Date(eventDateTime.getTime() - (30 * 60 * 1000)); // 30 minutes before
    const isAfterEventTime = now >= attendanceStartTime;
    const isAvailable = isEventDay && isAfterEventTime;

    return ApiResponse.success(res, {
      isAvailable,
      isEventDay,
      isAfterEventTime,
      eventDate: event.event_date,
      eventTime: event.event_time,
      eventTitle: event.title,
      message: isAvailable 
        ? 'Daftar hadir tersedia' 
        : !isEventDay 
          ? 'Daftar hadir hanya tersedia pada hari H event'
          : 'Daftar hadir hanya tersedia 30 menit sebelum kegiatan dimulai'
    }, 'Attendance availability checked');

  } catch (error) {
    console.error('Check attendance availability error:', error);
    return ApiResponse.error(res, 'Failed to check attendance availability');
  }
});

// Get user's attendance tokens
router.get('/tokens', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const tokens = await TokenService.getUserTokens(userId);
    
    return ApiResponse.success(res, tokens, 'Attendance tokens retrieved successfully');
  } catch (error) {
    console.error('Get attendance tokens error:', error);
    return ApiResponse.error(res, 'Failed to get attendance tokens');
  }
});

// Verify attendance token
router.post('/verify', async (req, res) => {
  try {
    const { token, event_id } = req.body;

    if (!token || !event_id) {
      return ApiResponse.badRequest(res, 'Token and event_id are required');
    }

    // Check if attendance is allowed (only on event day after event time)
    const [events] = await query(
      'SELECT event_date, event_time FROM events WHERE id = ?',
      [event_id]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    const event = events[0];
    const now = new Date();
    const eventDateTime = new Date(`${event.event_date} ${event.event_time}`);
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    console.log('🕐 Current time:', now.toISOString());
    console.log('🕐 Event time:', eventDateTime.toISOString());
    console.log('🕐 Event date:', event.event_date);
    console.log('🕐 Event time:', event.event_time);

    // Check if it's event day and after event time
    if (eventDate.getTime() !== today.getTime()) {
      return ApiResponse.badRequest(res, 'Daftar hadir hanya bisa dilakukan pada hari H event');
    }

    // Allow attendance 30 minutes before event starts
    const attendanceStartTime = new Date(eventDateTime.getTime() - (30 * 60 * 1000)); // 30 minutes before
    
    if (now < attendanceStartTime) {
      return ApiResponse.badRequest(res, 'Daftar hadir hanya bisa dilakukan 30 menit sebelum kegiatan dimulai');
    }

    const verification = await TokenService.verifyAttendanceToken(token, event_id);
    
    if (!verification.valid) {
      return ApiResponse.badRequest(res, verification.message);
    }

    return ApiResponse.success(res, {
      valid: true,
      user: {
        name: verification.tokenData.full_name,
        email: verification.tokenData.email
      },
      event: {
        title: verification.tokenData.event_title
      }
    }, 'Token verification successful');

  } catch (error) {
    console.error('Verify attendance token error:', error);
    return ApiResponse.error(res, 'Failed to verify attendance token');
  }
});

// Submit attendance
router.post('/submit', async (req, res) => {
  try {
    const { token, event_id } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    if (!token || !event_id) {
      return ApiResponse.badRequest(res, 'Token and event_id are required');
    }

    // Verify token first
    const verification = await TokenService.verifyAttendanceToken(token, event_id);
    
    if (!verification.valid) {
      return ApiResponse.badRequest(res, verification.message);
    }

    // Mark token as used and create attendance record
    const result = await TokenService.markTokenAsUsed(
      verification.tokenData.id,
      verification.tokenData.user_id,
      event_id,
      ipAddress,
      userAgent
    );

    return ApiResponse.success(res, {
      attendanceId: result.attendanceId,
      message: result.message,
      user: {
        name: verification.tokenData.full_name,
        email: verification.tokenData.email
      },
      event: {
        title: verification.tokenData.event_title
      }
    }, 'Attendance submitted successfully');

  } catch (error) {
    console.error('Submit attendance error:', error);
    return ApiResponse.error(res, 'Failed to submit attendance');
  }
});

// Get attendance records for an event (admin only)
router.get('/event/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if user is admin or event organizer
    const [events] = await query(
      'SELECT organizer_id FROM events WHERE id = ?',
      [eventId]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    if (req.user.role !== 'admin' && events[0].organizer_id !== userId) {
      return ApiResponse.forbidden(res, 'Access denied');
    }

    // Get attendance records
    const [attendanceRecords] = await query(
      `SELECT ar.*, u.full_name, u.email, at.token, at.created_at as token_created_at
       FROM attendance_records ar
       JOIN users u ON ar.user_id = u.id
       JOIN attendance_tokens at ON ar.token_id = at.id
       WHERE ar.event_id = ?
       ORDER BY ar.attendance_time DESC`,
      [eventId]
    );

    return ApiResponse.success(res, attendanceRecords, 'Attendance records retrieved successfully');

  } catch (error) {
    console.error('Get attendance records error:', error);
    return ApiResponse.error(res, 'Failed to get attendance records');
  }
});

// Get attendance statistics
router.get('/stats/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if user is admin or event organizer
    const [events] = await query(
      'SELECT organizer_id FROM events WHERE id = ?',
      [eventId]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    if (req.user.role !== 'admin' && events[0].organizer_id !== req.user.id) {
      return ApiResponse.forbidden(res, 'Access denied');
    }

    // Get statistics
    const [stats] = await query(
      `SELECT 
         COUNT(DISTINCT at.user_id) as total_registrations,
         COUNT(ar.id) as total_attendance,
         COUNT(CASE WHEN at.is_used = TRUE THEN 1 END) as tokens_used,
         COUNT(CASE WHEN at.is_used = FALSE AND at.expires_at > NOW() THEN 1 END) as tokens_active,
         COUNT(CASE WHEN at.expires_at < NOW() THEN 1 END) as tokens_expired
       FROM attendance_tokens at
       LEFT JOIN attendance_records ar ON at.id = ar.token_id
       WHERE at.event_id = ?`,
      [eventId]
    );

    const attendanceRate = stats[0].total_registrations > 0 
      ? ((stats[0].total_attendance / stats[0].total_registrations) * 100).toFixed(2)
      : 0;

    return ApiResponse.success(res, {
      totalRegistrations: stats[0].total_registrations,
      totalAttendance: stats[0].total_attendance,
      attendanceRate: parseFloat(attendanceRate),
      tokensUsed: stats[0].tokens_used,
      tokensActive: stats[0].tokens_active,
      tokensExpired: stats[0].tokens_expired
    }, 'Attendance statistics retrieved successfully');

  } catch (error) {
    console.error('Get attendance stats error:', error);
    return ApiResponse.error(res, 'Failed to get attendance statistics');
  }
});

module.exports = router;

