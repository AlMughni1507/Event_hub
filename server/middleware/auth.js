const jwt = require('jsonwebtoken');
const { query } = require('../db');

// Middleware untuk verifikasi JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data from database
    const [users] = await query(
      'SELECT id, username, email, full_name, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!users.length || !users[0].is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive user' 
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Middleware untuk role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Middleware untuk check if user is event organizer or admin
const authorizeEventAccess = async (req, res, next) => {
  try {
    const eventId = req.params.id || req.body.event_id;
    
    if (!eventId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event ID required' 
      });
    }

    const [events] = await query(
      'SELECT organizer_id FROM events WHERE id = ?',
      [eventId]
    );

    if (!events.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    const event = events[0];
    
    // Allow if user is admin or event organizer
    if (req.user.role === 'admin' || req.user.id === event.organizer_id) {
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied to this event' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Authorization error' 
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeEventAccess
};
