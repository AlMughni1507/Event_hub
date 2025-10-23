const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// POST /api/contact - Send contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

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

    const transporter = createTransporter();

    // Email to admin
    const adminMailOptions = {
      from: `"EventHub Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Admin email
      replyTo: email,
      subject: `[EventHub Contact] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #667eea; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Pesan Baru dari Contact Form</h1>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">Nama:</span> ${name}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="info-row">
                <span class="label">Subject:</span> ${subject}
              </div>
              <div class="message-box">
                <p class="label">Pesan:</p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <div class="footer">
                <p>Pesan ini dikirim dari EventHub Contact Form</p>
                <p>Balas langsung ke email pengirim: ${email}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Email confirmation to sender
    const senderMailOptions = {
      from: `"EventHub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Terima kasih telah menghubungi EventHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Pesan Anda Telah Diterima!</h1>
            </div>
            <div class="content">
              <p>Halo <strong>${name}</strong>,</p>
              <p>Terima kasih telah menghubungi EventHub. Kami telah menerima pesan Anda dan akan segera merespons dalam 1x24 jam.</p>
              
              <div class="message-box">
                <p><strong>Ringkasan Pesan Anda:</strong></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Pesan:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>Jika Anda memiliki pertanyaan mendesak, silakan hubungi kami melalui:</p>
              <ul>
                <li>📞 WhatsApp: +62 877-7728-1237</li>
                <li>📧 Email: ${process.env.SMTP_USER}</li>
              </ul>

              <div style="text-align: center;">
                <a href="http://localhost:5173" class="btn">Kembali ke EventHub</a>
              </div>

              <div class="footer">
                <p>Salam hangat,<br><strong>Tim EventHub</strong></p>
                <p style="margin-top: 20px;">Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(senderMailOptions);

    res.json({
      success: true,
      message: 'Pesan berhasil dikirim! Kami akan segera merespons.'
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
