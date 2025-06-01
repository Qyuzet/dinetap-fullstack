const express = require('express');
const router = express.Router();
const menuService = require('../services/menuService');
const { body, param, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// GET /api/menu/:id - Get a specific menu item
router.get('/:id', [
  param('id').notEmpty().withMessage('Menu item ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await menuService.getMenuItemById(id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item',
      error: error.message
    });
  }
});

// POST /api/menu - Create a new menu item
router.post('/', [
  body('name').notEmpty().withMessage('Menu item name is required'),
  body('description').notEmpty().withMessage('Menu item description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('portalId').notEmpty().withMessage('Portal ID is required'),
  body('tags').optional().isArray(),
  body('available').optional().isBoolean(),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  handleValidationErrors
], async (req, res) => {
  try {
    const menuItemData = req.body;
    const menuItem = await menuService.createMenuItem(menuItemData);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message
    });
  }
});

// PUT /api/menu/:id - Update a menu item
router.put('/:id', [
  param('id').notEmpty().withMessage('Menu item ID is required'),
  body('name').optional().notEmpty().withMessage('Menu item name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Menu item description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('tags').optional().isArray(),
  body('available').optional().isBoolean(),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const menuItem = await menuService.updateMenuItem(id, updateData);

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
});

// DELETE /api/menu/:id - Delete a menu item
router.delete('/:id', [
  param('id').notEmpty().withMessage('Menu item ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    await menuService.deleteMenuItem(id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item',
      error: error.message
    });
  }
});

// PATCH /api/menu/:id/availability - Update menu item availability
router.patch('/:id/availability', [
  param('id').notEmpty().withMessage('Menu item ID is required'),
  body('available').isBoolean().withMessage('Available must be a boolean'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    const menuItem = await menuService.updateMenuItemAvailability(id, available);

    res.json({
      success: true,
      message: 'Menu item availability updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item availability',
      error: error.message
    });
  }
});

module.exports = router;
