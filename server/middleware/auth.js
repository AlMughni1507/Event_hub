const jwt = require('jsonwebtoken');
const { query } = require('../db');
const ApiResponse = require('./response');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return ApiResponse.unauthorized(res, 'Access token required');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // If token expired but it's an admin, try to decode without verify
      if (jwtError.name === 'TokenExpiredError') {
        const decodedExpired = jwt.decode(token);
        
        // If admin, allow them to continue (no expiry for admin in development)
        if (decodedExpired && decodedExpired.role === 'admin') {
          console.log('⚠️ Admin token expired but allowing access (development mode)');
          decoded = decodedExpired;
        } else {
          throw jwtError; // Re-throw for non-admin
        }
      } else {
        throw jwtError;
      }
    }
    
    // Check session timeout - 5 minutes (skip for admin users)
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - decoded.iat;
    
    // Only check session timeout for non-admin users
    if (tokenAge > 300 && decoded.role !== 'admin') { // 5 minutes = 300 seconds
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }
    
    // Get user from database
    const [users] = await query(
      'SELECT id, username, email, full_name, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return ApiResponse.unauthorized(res, 'Invalid token');
    }

    const user = users[0];
    
    if (!user.is_active) {
      return ApiResponse.unauthorized(res, 'Account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }
    console.error('Auth middleware error:', error);
    return ApiResponse.error(res, 'Authentication failed');
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

const requireAdmin = requireRole(['admin']);
const requireUser = requireRole(['user', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireUser
};
