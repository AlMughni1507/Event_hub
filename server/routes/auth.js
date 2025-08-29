const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middleware/validation');
const ApiResponse = require('../middleware/response');
const { sendOtpEmail, sendWelcomeEmail } = require('../utils/email');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Helper function to sanitize user object
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Register user
router.post('/register', validateUserRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { username, email, password, full_name, phone } = req.body;

    // Check if user already exists
    const [existingUsers] = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return ApiResponse.conflict(res, 'User with this email or username already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (inactive by default)
    const [result] = await query(
      'INSERT INTO users (username, email, password, full_name, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?, FALSE)',
      [username, email, hashedPassword, full_name, phone, 'user']
    );

    // Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await query(
      'INSERT INTO email_otps (email, otp_code, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    // Send OTP email
    console.log(`🔍 Attempting to send OTP ${otp} to ${email}`);
    try {
      console.log('📧 SMTP Config Check:');
      console.log('Host:', process.env.SMTP_HOST);
      console.log('Port:', process.env.SMTP_PORT);
      console.log('User:', process.env.SMTP_USER);
      console.log('Pass configured:', process.env.SMTP_PASS ? 'YES' : 'NO');
      
      const emailSent = await sendOtpEmail(email, otp);
      console.log(`📧 Email send result: ${emailSent}`);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      console.error('❌ Full email error:', emailError);
      // Continue with registration even if email fails
      console.log('⚠️ Registration continues despite email failure');
    }

    return ApiResponse.created(res, 
      { user_id: result.insertId }, 
      'Registration successful. Please check your email for OTP verification.'
    );

  } catch (error) {
    console.error('Registration error:', error);
    return ApiResponse.error(res, 'Registration failed');
  }
});

// Login user
router.post('/login', validateUserLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await query(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      return ApiResponse.unauthorized(res, 'Account is not activated. Please verify your email first.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data and token
    return ApiResponse.success(res, {
      user: sanitizeUser(user),
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse.error(res, 'Login failed');
  }
});

// Admin login
router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Admin login attempt:', { email });

    // Find admin user
    const [users] = await query(
      'SELECT id, username, email, password, full_name, role, is_active FROM users WHERE email = ? AND role = "admin"',
      [email]
    );

    console.log('🔍 Users found:', users.length);

    if (users.length === 0) {
      console.log('❌ Admin not found');
      return ApiResponse.unauthorized(res, 'Admin not found or wrong credentials');
    }

    const user = users[0];
    console.log('🔍 User found:', { id: user.id, email: user.email, role: user.role, is_active: user.is_active });

    // Check if account is active
    if (!user.is_active) {
      console.log('❌ Admin account deactivated');
      return ApiResponse.unauthorized(res, 'Admin account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔍 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return ApiResponse.unauthorized(res, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);
    console.log('✅ Admin login successful');

    // Return user data and token
    return ApiResponse.success(res, {
      user: sanitizeUser(user),
      token
    }, 'Admin login successful');

  } catch (error) {
    console.error('❌ Admin login error:', error);
    return ApiResponse.error(res, 'Login failed');
  }
});

// Request OTP (resend)
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    // Check if user exists
    const [users] = await query('SELECT id, is_active FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (users[0].is_active) {
      return ApiResponse.badRequest(res, 'Account is already activated');
    }

    // Delete old OTPs
    await query('DELETE FROM email_otps WHERE email = ?', [email]);

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      'INSERT INTO email_otps (email, otp_code, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    // Send OTP email
    console.log(`🔍 Resending OTP ${otp} to ${email}`);
    try {
      const emailSent = await sendOtpEmail(email, otp);
      console.log(`📧 Resend email result: ${emailSent}`);
    } catch (emailError) {
      console.error('❌ Resend email failed:', emailError.message);
      // Continue anyway - user can try again
    }

    return ApiResponse.success(res, null, 'OTP sent to your email');

  } catch (error) {
    console.error('Request OTP error:', error);
    return ApiResponse.error(res, 'Failed to send OTP');
  }
});

// Verify email with OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ApiResponse.badRequest(res, 'Email and OTP are required');
    }

    console.log(`🔍 Verifying OTP for ${email}: ${otp}`);


    // Find valid OTP
    const [otps] = await query(
      'SELECT * FROM email_otps WHERE email = ? AND otp_code = ? AND expires_at > NOW()',
      [email, otp]
    );

    console.log(`🔍 Found ${otps.length} valid OTP records`);

    if (otps.length === 0) {
      // Check if there are any OTPs for this email (expired or invalid)
      const [allOtps] = await query('SELECT * FROM email_otps WHERE email = ?', [email]);
      console.log(`🔍 Total OTP records for ${email}: ${allOtps.length}`);
      
      if (allOtps.length > 0) {
        console.log('🔍 Latest OTP record:', allOtps[allOtps.length - 1]);
      }
      // TEMPORARY: Allow bypass OTP for development (when SMTP not configured)
      if (otp === '000000' || otp === '123456') {
        console.log('⚠️ Using development bypass OTP');
        
        // Activate user
        await query('UPDATE users SET is_active = TRUE WHERE email = ?', [email]);
        
        return ApiResponse.success(res, null, 'Email verified successfully (DEV MODE). Welcome!');
      }
      return ApiResponse.badRequest(res, 'Invalid or expired OTP');
    }

    // Activate user
    await query('UPDATE users SET is_active = TRUE WHERE email = ?', [email]);

    // Get user data for welcome email
    const [users] = await query('SELECT full_name FROM users WHERE email = ?', [email]);
    
    // Delete used OTP
    await query('DELETE FROM email_otps WHERE email = ?', [email]);

    // Send welcome email
    if (users.length > 0) {
      await sendWelcomeEmail(email, users[0].full_name);
    }

    return ApiResponse.success(res, null, 'Email verified successfully. Welcome!');

  } catch (error) {
    console.error('Verify email error:', error);
    return ApiResponse.error(res, 'Failed to verify email');
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await query(
      'SELECT id, username, email, full_name, phone, role, is_active, created_at FROM users WHERE id = ?',
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

    if (!full_name) {
      return ApiResponse.badRequest(res, 'Full name is required');
    }

    await query(
      'UPDATE users SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, phone, req.user.id]
    );

    const [users] = await query(
      'SELECT id, username, email, full_name, phone, role, is_active, created_at FROM users WHERE id = ?',
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

    // Get current password
    const [users] = await query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, users[0].password);
    if (!isCurrentPasswordValid) {
      return ApiResponse.badRequest(res, 'Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 12);

    // Update password
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

// Seed admin (one-time setup)
router.post('/seed-admin', async (req, res) => {
  try {
    const { username = 'admin', email = 'admin@gmail.com', password = 'admin123', full_name = 'System Administrator', key } = req.body;

    // Check seed key
    if (!process.env.ADMIN_SEED_KEY) {
      return ApiResponse.forbidden(res, 'Admin seeding is disabled');
    }

    if (key !== process.env.ADMIN_SEED_KEY) {
      return ApiResponse.forbidden(res, 'Invalid seed key');
    }

    // Check if admin already exists
    const [existing] = await query(
      'SELECT id FROM users WHERE role = "admin" OR email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return ApiResponse.conflict(res, 'Admin already exists or email/username is taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    await query(
      'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, "admin", TRUE)',
      [username, email, hashedPassword, full_name]
    );

    return ApiResponse.success(res, null, 'Admin seeded successfully');

  } catch (error) {
    console.error('Seed admin error:', error);
    return ApiResponse.error(res, 'Failed to seed admin');
  }
});

module.exports = router;
