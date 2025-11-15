const express = require('express');
const router = express.Router();
const { query } = require('../db');

// POST /api/contact - Send contact message (saves to database)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    // Save to database
    const [result] = await query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject, message]
    );

    res.json({
      success: true,
      message: 'Pesan berhasil dikirim! Kami akan segera merespons.',
      contact_id: result.insertId
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi kami melalui WhatsApp.'
    });
  }
});

module.exports = router;
