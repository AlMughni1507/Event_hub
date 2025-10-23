const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { query } = require('../db');
const ApiResponse = require('../middleware/response');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'abdul.mughni845@gmail.com';
      
      const mailOptions = {
        from: `"EventHub Contact Form" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🔔 New Contact Form Submission: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .info-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 5px; }
              .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
              .value { color: #333; }
              .message-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📬 New Contact Message</h1>
                <p style="margin: 10px 0 0 0;">EventHub Contact Form</p>
              </div>
              <div class="content">
                <p>You have received a new message from the EventHub contact form:</p>
                
                <div class="info-box">
                  <div class="label">👤 Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="info-box">
                  <div class="label">📧 Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                
                ${phone ? `
                <div class="info-box">
                  <div class="label">📞 Phone:</div>
                  <div class="value">${phone}</div>
                </div>
                ` : ''}
                
                <div class="info-box">
                  <div class="label">📝 Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                
                <div class="message-box">
                  <div class="label">💬 Message:</div>
                  <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
                </div>
                
                <div style="text-align: center;">
                  <a href="http://localhost:5173/admin/contacts" class="button">View in Admin Panel</a>
                </div>
                
                <div class="footer">
                  <p>This email was sent from EventHub Contact Form</p>
                  <p>Contact ID: #${result.insertId}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Contact notification email sent to admin');
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

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
