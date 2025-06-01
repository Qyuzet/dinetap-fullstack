const express = require('express');
const router = express.Router();
const portalService = require('../services/portalService');
const menuService = require('../services/menuService');
const { body, param, query, validationResult } = require('express-validator');

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

// GET /api/portals - Get all portals for a user
router.get('/', [
  query('userId').notEmpty().withMessage('User ID is required'),
  query('status').optional().isIn(['active', 'inactive', 'draft']),
  query('search').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { userId, status, search } = req.query;
    
    let portals;
    if (search) {
      portals = await portalService.searchPortals(search, userId);
    } else if (status) {
      portals = await portalService.getPortalsByStatus(status);
      // Filter by userId
      portals = portals.filter(portal => portal.userId === userId);
    } else {
      portals = await portalService.getUserPortals(userId);
    }

    res.json({
      success: true,
      data: portals
    });
  } catch (error) {
    console.error('Error fetching portals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portals',
      error: error.message
    });
  }
});

// GET /api/portals/:id - Get a specific portal
router.get('/:id', [
  param('id').notEmpty().withMessage('Portal ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const portal = await portalService.getPortalById(id);
    
    if (!portal) {
      return res.status(404).json({
        success: false,
        message: 'Portal not found'
      });
    }

    res.json({
      success: true,
      data: portal
    });
  } catch (error) {
    console.error('Error fetching portal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portal',
      error: error.message
    });
  }
});

// POST /api/portals - Create a new portal
router.post('/', [
  body('name').notEmpty().withMessage('Portal name is required'),
  body('description').notEmpty().withMessage('Portal description is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('status').optional().isIn(['active', 'inactive', 'draft']),
  body('colors.primary').optional().isString(),
  body('colors.secondary').optional().isString(),
  body('colors.accent').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const portalData = req.body;
    const portal = await portalService.createPortal(portalData);

    res.status(201).json({
      success: true,
      message: 'Portal created successfully',
      data: portal
    });
  } catch (error) {
    console.error('Error creating portal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create portal',
      error: error.message
    });
  }
});

// PUT /api/portals/:id - Update a portal
router.put('/:id', [
  param('id').notEmpty().withMessage('Portal ID is required'),
  body('name').optional().notEmpty().withMessage('Portal name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Portal description cannot be empty'),
  body('status').optional().isIn(['active', 'inactive', 'draft']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const portal = await portalService.updatePortal(id, updateData);

    res.json({
      success: true,
      message: 'Portal updated successfully',
      data: portal
    });
  } catch (error) {
    console.error('Error updating portal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update portal',
      error: error.message
    });
  }
});

// DELETE /api/portals/:id - Delete a portal
router.delete('/:id', [
  param('id').notEmpty().withMessage('Portal ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    await portalService.deletePortal(id);

    res.json({
      success: true,
      message: 'Portal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting portal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete portal',
      error: error.message
    });
  }
});

// GET /api/portals/:id/menu - Get menu items for a portal
router.get('/:id/menu', [
  param('id').notEmpty().withMessage('Portal ID is required'),
  query('category').optional().isString(),
  query('search').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { category, search } = req.query;
    
    let menuItems;
    if (search) {
      menuItems = await menuService.searchMenuItems(id, search);
    } else if (category) {
      menuItems = await menuService.getMenuItemsByCategory(id, category);
    } else {
      menuItems = await menuService.getMenuItems(id);
    }

    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
});

// GET /api/portals/:id/categories - Get menu categories for a portal
router.get('/:id/categories', [
  param('id').notEmpty().withMessage('Portal ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await menuService.getMenuCategories(id);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu categories',
      error: error.message
    });
  }
});

module.exports = router;
