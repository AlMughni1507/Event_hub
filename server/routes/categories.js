const express = require('express');
const { query } = require('../db');
const { validateCategory, handleValidationErrors } = require('../middleware/validation');
const ApiResponse = require('../middleware/response');

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const [categories] = await query(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC'
    );

    return ApiResponse.success(res, categories, 'Categories retrieved successfully');

  } catch (error) {
    console.error('Get categories error:', error);
    return ApiResponse.error(res, 'Failed to get categories');
  }
});

// Get category by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await query(
      'SELECT * FROM categories WHERE id = ? AND is_active = 1',
      [id]
    );

    if (categories.length === 0) {
      return ApiResponse.notFound(res, 'Category not found');
    }

    return ApiResponse.success(res, categories[0], 'Category retrieved successfully');

  } catch (error) {
    console.error('Get category error:', error);
    return ApiResponse.error(res, 'Failed to get category');
  }
});

module.exports = router;
