const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middleware/validation');
const ApiResponse = require('../middleware/response');

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

    // Create user (active by default)
    const [result] = await query(
      'INSERT INTO users (username, email, password, full_name, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
      [username, email, hashedPassword, full_name, phone, 'user']
    );

    // Get the created user for auto-login
    const [users] = await query(
      'SELECT id, username, email, full_name, role, is_active FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    const token = generateToken(user.id);

    return ApiResponse.created(res, {
      user: sanitizeUser(user),
      token
    }, 'Registration successful. You are now logged in!');

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


// Reset admin password (for troubleshooting)
router.post('/reset-admin-password', async (req, res) => {
  try {
    const { email = 'abdul.mughni845@gmail.com', password = 'admin123' } = req.body;

    console.log('🔄 Resetting admin password for:', email);

    // Find admin user
    const [users] = await query(
      'SELECT id, email, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ Admin user not found');
      return ApiResponse.notFound(res, 'Admin user not found');
    }

    const user = users[0];
    console.log('🔍 Found user:', { id: user.id, email: user.email, role: user.role });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hashed successfully');

    // Update password and ensure admin role and active status
    const [result] = await query(
      'UPDATE users SET password = ?, role = "admin", is_active = 1 WHERE email = ?',
      [hashedPassword, email]
    );

    console.log('✅ Password reset successful');

    return ApiResponse.success(res, {
      email: email,
      password: password,
      role: 'admin',
      is_active: true
    }, 'Admin password reset successfully');

  } catch (error) {
    console.error('❌ Reset admin password error:', error);
    return ApiResponse.error(res, 'Failed to reset admin password');
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
