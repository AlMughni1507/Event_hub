const express = require('express');
const midtransClient = require('midtrans-client');
const { query } = require('../db');
const { authenticateToken, requireUser } = require('../middleware/auth');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Initialize Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Create simple database payment (no external gateway)
router.post('/create', authenticateToken, requireUser, async (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user.id;

    // Get event details
    const [events] = await query(
      'SELECT * FROM events WHERE id = ? AND is_active = 1',
      [event_id]
    );

    if (events.length === 0) {
      return ApiResponse.notFound(res, 'Event not found');
    }

    const event = events[0];

    // Check if user already registered
    const [existingRegistrations] = await query(
      'SELECT * FROM registrations WHERE event_id = ? AND user_id = ?',
      [event_id, user_id]
    );

    if (existingRegistrations.length > 0) {
      return ApiResponse.badRequest(res, 'You are already registered for this event');
    }

    // Check if event is full
    const [registrationCount] = await query(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status = "confirmed"',
      [event_id]
    );

    if (registrationCount[0].count >= event.max_participants) {
      return ApiResponse.badRequest(res, 'Event is full');
    }

    // Generate order ID
    const orderId = `EVENT-${event_id}-${user_id}-${Date.now()}`;

    // Create registration record with confirmed status (simulate instant payment)
    const [registrationResult] = await query(
      'INSERT INTO registrations (event_id, user_id, payment_method, status, payment_amount) VALUES (?, ?, ?, ?, ?)',
      [event_id, user_id, 'midtrans', 'confirmed', event.price]
    );

    // Store payment details as successful
    await query(
      'INSERT INTO payments (registration_id, order_id, amount, payment_method, status, payment_date) VALUES (?, ?, ?, ?, ?, NOW())',
      [registrationResult.insertId, orderId, event.price, 'database', 'success']
    );

    return ApiResponse.success(res, {
      order_id: orderId,
      amount: event.registration_fee,
      status: 'success',
      message: 'Registration successful! Payment completed.'
    }, 'Registration and payment completed successfully');

  } catch (error) {
    console.error('Create payment error:', error);
    return ApiResponse.error(res, 'Failed to create payment');
  }
});

// Handle Midtrans notification
router.post('/notification', async (req, res) => {
  try {
    const notification = req.body;
    
    console.log('Midtrans notification:', notification);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let paymentStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        paymentStatus = 'challenge';
      } else if (fraudStatus === 'accept') {
        paymentStatus = 'success';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'success';
    } else if (transactionStatus === 'cancel' || 
               transactionStatus === 'deny' || 
               transactionStatus === 'expire') {
      paymentStatus = 'failed';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
    }

    // Update payment status
    await query(
      'UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [paymentStatus, orderId]
    );

    // Update registration status if payment successful
    if (paymentStatus === 'success') {
      await query(
        'UPDATE registrations SET status = "confirmed", updated_at = CURRENT_TIMESTAMP WHERE payment_method = ? LIMIT 1',
        [orderId]
      );
    } else if (paymentStatus === 'failed') {
      await query(
        'UPDATE registrations SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE payment_method = ? LIMIT 1',
        [orderId]
      );
    }

    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('Payment notification error:', error);
    res.status(500).json({ status: 'ERROR' });
  }
});

// Get payment status
router.get('/status/:orderId', authenticateToken, requireUser, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [payments] = await query(
      `SELECT p.*, r.event_id, e.title as event_title 
       FROM payments p
       JOIN registrations r ON p.registration_id = r.id
       JOIN events e ON r.event_id = e.id
       WHERE p.order_id = ? AND r.user_id = ?`,
      [orderId, req.user.id]
    );

    if (payments.length === 0) {
      return ApiResponse.notFound(res, 'Payment not found');
    }

    return ApiResponse.success(res, payments[0], 'Payment status retrieved successfully');

  } catch (error) {
    console.error('Get payment status error:', error);
    return ApiResponse.error(res, 'Failed to get payment status');
  }
});

// Get user payment history
router.get('/history', authenticateToken, requireUser, async (req, res) => {
  try {
    const [payments] = await query(
      `SELECT p.*, r.event_id, e.title as event_title, e.event_date
       FROM payments p
       JOIN registrations r ON p.registration_id = r.id
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    return ApiResponse.success(res, payments, 'Payment history retrieved successfully');

  } catch (error) {
    console.error('Get payment history error:', error);
    return ApiResponse.error(res, 'Failed to get payment history');
  }
});

module.exports = router;
