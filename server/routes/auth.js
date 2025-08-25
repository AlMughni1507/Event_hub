const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const ApiResponse = require('../utils/response');

const router = express.Router();

// Helper to issue JWT and sanitize user
function issueTokenAndRespond(res, user, message = 'Login successful') {
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  delete user.password;
  return ApiResponse.success(res, { user, token }, message);
}

// Register user (visitor / normal user)
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { username, email, password, full_name, phone } = req.body;

    const [existingUsers] = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return ApiResponse.conflict(res, 'User with this email or username already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await query(
      'INSERT INTO users (username, email, password, full_name, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?, FALSE)',
      [username, email, hashedPassword, full_name, phone, 'user']
    );

    // Send OTP
    const { generateOtpCode, otpEmailTemplate, sendEmail } = require('../utils/email');
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await query(
      'INSERT INTO email_otps (user_id, email, otp_code, expires_at) VALUES (?, ?, ?, ?)',
      [result.insertId, email, code, expiresAt]
    );
    await sendEmail(email, 'Kode OTP Verifikasi Email', otpEmailTemplate(code));

    return ApiResponse.created(res, { user_id: result.insertId }, 'Registered. OTP sent to email. Please verify to activate account');

  } catch (error) {
    console.error('Registration error:', error);
    return ApiResponse.error(res, 'Registration failed');
  }
});

// Request new OTP (resend)
router.post('/request-email-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return ApiResponse.badRequest(res, 'Email is required');

    const [users] = await query('SELECT id, is_active FROM users WHERE email = ?', [email]);
    if (!users.length) return ApiResponse.notFound(res, 'Email not found');
    if (users[0].is_active) return ApiResponse.conflict(res, 'Account already verified');

    const { generateOtpCode, otpEmailTemplate, sendEmail } = require('../utils/email');
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query('DELETE FROM email_otps WHERE email = ?', [email]);
    await query('INSERT INTO email_otps (user_id, email, otp_code, expires_at) VALUES (?, ?, ?, ?)', [users[0].id, email, code, expiresAt]);
    await sendEmail(email, 'Kode OTP Verifikasi Email', otpEmailTemplate(code));

    return ApiResponse.success(res, null, 'OTP sent');
  } catch (e) {
    console.error('Request OTP error:', e);
    return ApiResponse.error(res, 'Failed to send OTP');
  }
});

// Verify email with OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return ApiResponse.badRequest(res, 'Email and code are required');

    const [rows] = await query('SELECT * FROM email_otps WHERE email = ? AND otp_code = ? AND is_used = FALSE AND expires_at > NOW() ORDER BY id DESC LIMIT 1', [email, code]);
    if (!rows.length) return ApiResponse.unauthorized(res, 'Invalid or expired OTP');

    const otp = rows[0];
    await query('UPDATE users SET is_active = TRUE WHERE id = ?', [otp.user_id]);
    await query('UPDATE email_otps SET is_used = TRUE WHERE id = ?', [otp.id]);

    return ApiResponse.success(res, null, 'Email verified successfully');
  } catch (e) {
    console.error('Verify email error:', e);
    return ApiResponse.error(res, 'Failed to verify email');
  }
});

// Generic login
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await query(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    const user = users[0];

    if (!user.is_active) {
      return ApiResponse.unauthorized(res, 'Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    return issueTokenAndRespond(res, user);

  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse.error(res, 'Login failed');
  }
});

// Role-specific login endpoints
router.post('/login/admin', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await query(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ? AND role = "admin"',
      [email]
    );
    if (!users.length) return ApiResponse.unauthorized(res, 'Admin not found or wrong credentials');
    const user = users[0];
    if (!user.is_active) return ApiResponse.unauthorized(res, 'Account is deactivated');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return ApiResponse.unauthorized(res, 'Invalid email or password');
    return issueTokenAndRespond(res, user, 'Admin login successful');
  } catch (e) {
    console.error('Admin login error:', e);
    return ApiResponse.error(res, 'Login failed');
  }
});

router.post('/login/organizer', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await query(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ? AND role = "organizer"',
      [email]
    );
    if (!users.length) return ApiResponse.unauthorized(res, 'Organizer not found or wrong credentials');
    const user = users[0];
    if (!user.is_active) return ApiResponse.unauthorized(res, 'Account is deactivated');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return ApiResponse.unauthorized(res, 'Invalid email or password');
    return issueTokenAndRespond(res, user, 'Organizer login successful');
  } catch (e) {
    console.error('Organizer login error:', e);
    return ApiResponse.error(res, 'Login failed');
  }
});

router.post('/login/user', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await query(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ? AND role = "user"',
      [email]
    );
    if (!users.length) return ApiResponse.unauthorized(res, 'User not found or wrong credentials');
    const user = users[0];
    if (!user.is_active) return ApiResponse.unauthorized(res, 'Account is deactivated');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return ApiResponse.unauthorized(res, 'Invalid email or password');
    return issueTokenAndRespond(res, user, 'User login successful');
  } catch (e) {
    console.error('User login error:', e);
    return ApiResponse.error(res, 'Login failed');
  }
});

// Admin-only: create user with specific role (admin creates organizer/admin/user)
router.post('/admin/create-user', authenticateToken, async (req, res) => {
  try {
    // Verify requester is admin
    const [requesters] = await query('SELECT role FROM users WHERE id = ?', [req.user.id]);
    if (!requesters.length || requesters[0].role !== 'admin') {
      return ApiResponse.forbidden(res, 'Admin privileges required');
    }

    const { username, email, password, full_name, phone, role = 'user' } = req.body;
    if (!['admin', 'organizer', 'user'].includes(role)) {
      return ApiResponse.badRequest(res, 'Invalid role');
    }

    const [exists] = await query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (exists.length) return ApiResponse.conflict(res, 'User with this email or username already exists');

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await query(
      'INSERT INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashed, full_name, phone, role]
    );

    const [created] = await query('SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?', [result.insertId]);
    return ApiResponse.created(res, created[0], 'User created successfully');
  } catch (e) {
    console.error('Admin create-user error:', e);
    return ApiResponse.error(res, 'Failed to create user');
  }
});

// Seed admin using secret key (one-off initializer)
router.post('/seed-admin', async (req, res) => {
  try {
    const { username = 'admin', email = 'admin@eventapp.com', password = 'admin123', full_name = 'System Administrator', key } = req.body;
    if (!process.env.ADMIN_SEED_KEY) {
      return ApiResponse.forbidden(res, 'Seeding disabled (no ADMIN_SEED_KEY set)');
    }
    if (key !== process.env.ADMIN_SEED_KEY) {
      return ApiResponse.forbidden(res, 'Invalid seed key');
    }

    const [existing] = await query('SELECT id FROM users WHERE role = "admin" OR email = ? OR username = ?', [email, username]);
    if (existing.length) {
      return ApiResponse.conflict(res, 'Admin already exists or email/username taken');
    }

    const hashed = await bcrypt.hash(password, 12);
    await query(
      'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, "admin", TRUE)',
      [username, email, hashed, full_name]
    );

    return ApiResponse.success(res, null, 'Admin seeded successfully');
  } catch (e) {
    console.error('Seed admin error:', e);
    return ApiResponse.error(res, e.message || 'Failed to seed admin');
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await query(
      'SELECT id, username, email, full_name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    return ApiResponse.success(res, users[0], 'Profile retrieved successfully');

  } catch (error) {
    console.error('Get profile error:', error);
    return ApiResponse.error(res, 'Failed to get profile');
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name, phone } = req.body;

    await query(
      'UPDATE users SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, phone, req.user.id]
    );

    const [users] = await query(
      'SELECT id, username, email, full_name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    return ApiResponse.success(res, users[0], 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    return ApiResponse.error(res, 'Failed to update profile');
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return ApiResponse.badRequest(res, 'Current password and new password are required');
    }

    if (new_password.length < 6) {
      return ApiResponse.badRequest(res, 'New password must be at least 6 characters long');
    }

    const [users] = await query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    const isCurrentPasswordValid = await bcrypt.compare(current_password, users[0].password);
    if (!isCurrentPasswordValid) {
      return ApiResponse.badRequest(res, 'Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 12);

    await query(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, req.user.id]
    );

    return ApiResponse.success(res, null, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    return ApiResponse.error(res, 'Failed to change password');
  }
});

module.exports = router;
