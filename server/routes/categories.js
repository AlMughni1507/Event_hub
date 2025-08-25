const express = require('express');
const { query } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const ApiResponse = require('../utils/response');

const router = express.Router();

// Get all categories
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

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const [categories] = await query(
      'SELECT * FROM categories WHERE id = ? AND is_active = 1',
      [categoryId]
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

// Create new category (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name) {
      return ApiResponse.badRequest(res, 'Category name is required');
    }

    // Check if category already exists
    const [existingCategories] = await query(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existingCategories.length > 0) {
      return ApiResponse.conflict(res, 'Category with this name already exists');
    }

    const [result] = await query(
      'INSERT INTO categories (name, description, icon, color) VALUES (?, ?, ?, ?)',
      [name, description, icon, color || '#007bff']
    );

    // Get created category
    const [newCategory] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    return ApiResponse.created(res, newCategory[0], 'Category created successfully');

  } catch (error) {
    console.error('Create category error:', error);
    return ApiResponse.error(res, 'Failed to create category');
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, icon, color, is_active } = req.body;

    // Check if category exists
    const [existingCategories] = await query(
      'SELECT id FROM categories WHERE id = ?',
      [categoryId]
    );

    if (existingCategories.length === 0) {
      return ApiResponse.notFound(res, 'Category not found');
    }

    // Check if name is being changed and if it conflicts
    if (name) {
      const [nameConflict] = await query(
        'SELECT id FROM categories WHERE name = ? AND id != ?',
        [name, categoryId]
      );

      if (nameConflict.length > 0) {
        return ApiResponse.conflict(res, 'Category with this name already exists');
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }

    if (icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }

    if (color !== undefined) {
      updateFields.push('color = ?');
      updateValues.push(color);
    }

    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return ApiResponse.badRequest(res, 'No fields to update');
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(categoryId);

    const query = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`;
    await query(query, updateValues);

    // Get updated category
    const [updatedCategory] = await query(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    return ApiResponse.success(res, updatedCategory[0], 'Category updated successfully');

  } catch (error) {
    console.error('Update category error:', error);
    return ApiResponse.error(res, 'Failed to update category');
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category has events
    const [events] = await query(
      'SELECT COUNT(*) as count FROM events WHERE category_id = ?',
      [categoryId]
    );

    if (events[0].count > 0) {
      return ApiResponse.conflict(res, 'Cannot delete category with existing events');
    }

    // Delete category
    await query('DELETE FROM categories WHERE id = ?', [categoryId]);

    return ApiResponse.success(res, null, 'Category deleted successfully');

  } catch (error) {
    console.error('Delete category error:', error);
    return ApiResponse.error(res, 'Failed to delete category');
  }
});

module.exports = router;
