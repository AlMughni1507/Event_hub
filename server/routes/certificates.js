const express = require('express');
const { query } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Get my certificates (authenticated user)
router.get('/my-certificates', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user;

    const [certs] = await query(
      `SELECT c.*, e.title as event_title, e.event_date
       FROM certificates c
       LEFT JOIN events e ON c.event_id = e.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    return ApiResponse.success(res, { certificates: certs }, 'Certificates retrieved');
  } catch (error) {
    console.error('Get my certificates error:', error);
    return ApiResponse.error(res, 'Failed to fetch certificates');
  }
});

// Get certificate by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await query(
      `SELECT c.* FROM certificates c WHERE c.id = ?`,
      [id]
    );
    if (rows.length === 0) return ApiResponse.notFound(res, 'Certificate not found');
    return ApiResponse.success(res, rows[0]);
  } catch (error) {
    console.error('Get certificate error:', error);
    return ApiResponse.error(res, 'Failed to fetch certificate');
  }
});

module.exports = router;

