const { body, validationResult } = require('express-validator');
const ApiResponse = require('./response');

// Validation rules
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]{8,15}$/)
    .withMessage('Phone number must be 8-15 digits and can contain +, -, spaces, and parentheses')
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('event_date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),
  
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Please provide a valid category ID'),
  
  body('max_participants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive number'),
  
  body('registration_fee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Registration fee must be a non-negative number')
];

const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
];

const validateRegistration = [
  body('event_id')
    .isInt({ min: 1 })
    .withMessage('Please provide a valid event ID'),
  
  body('payment_method')
    .optional()
    .isIn(['cash', 'transfer', 'card'])
    .withMessage('Payment method must be cash, transfer, or card')
];

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    return ApiResponse.validationError(res, errorMessages);
  }
  
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateEvent,
  validateCategory,
  validateRegistration,
  handleValidationErrors
};
