const { body, param, query, validationResult } = require('express-validator');

// Middleware untuk handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validation rules untuk user registration
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('full_name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .trim(),
  
  body('phone')
    .optional()
    .isMobilePhone('id-ID')
    .withMessage('Please provide a valid Indonesian phone number'),
  
  handleValidationErrors
];

// Validation rules untuk user login
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules untuk event creation
const validateEventCreation = [
  body('title')
    .isLength({ min: 5, max: 255 })
    .withMessage('Event title must be between 5 and 255 characters')
    .trim(),
  
  body('description')
    .isLength({ min: 10 })
    .withMessage('Event description must be at least 10 characters long'),
  
  body('short_description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Short description cannot exceed 500 characters'),
  
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  
  body('event_date')
    .isISO8601()
    .withMessage('Event date must be a valid date')
    .custom(value => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  
  body('event_time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Event time must be in HH:MM format'),
  
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  body('end_time')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('location')
    .isLength({ min: 3, max: 255 })
    .withMessage('Location must be between 3 and 255 characters'),
  
  body('address')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Address cannot exceed 1000 characters'),
  
  body('city')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('province')
    .isLength({ min: 2, max: 100 })
    .withMessage('Province must be between 2 and 100 characters'),
  
  body('max_participants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('registration_deadline')
    .optional()
    .isISO8601()
    .withMessage('Registration deadline must be a valid date'),
  
  handleValidationErrors
];

// Validation rules untuk event update
const validateEventUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  body('title')
    .optional()
    .isLength({ min: 5, max: 255 })
    .withMessage('Event title must be between 5 and 255 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Event description must be at least 10 characters long'),
  
  body('status')
    .optional()
    .isIn(['draft', 'published', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
  
  handleValidationErrors
];

// Validation rules untuk registration
const validateRegistration = [
  body('event_id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// Validation rules untuk review
const validateReview = [
  body('event_id')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// Validation rules untuk pagination
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateEventCreation,
  validateEventUpdate,
  validateRegistration,
  validateReview,
  validatePagination
};
