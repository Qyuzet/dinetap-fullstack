const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const portalService = require('../services/portalService');
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

// POST /api/ai/analyze-restaurant - Analyze restaurant and generate data
router.post('/analyze-restaurant', [
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('websiteUrl').optional().isURL().withMessage('Valid website URL is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { restaurantName, websiteUrl } = req.body;
    
    console.log(`Analyzing restaurant: ${restaurantName}`);
    
    const result = await aiService.generateRestaurantData(restaurantName, websiteUrl);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to analyze restaurant'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant analyzed successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error analyzing restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze restaurant',
      error: error.message
    });
  }
});

// POST /api/ai/generate-portal - Generate complete restaurant portal
router.post('/generate-portal', [
  body('restaurantName').notEmpty().withMessage('Restaurant name is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('websiteUrl').optional().isURL().withMessage('Valid website URL is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { restaurantName, userId, websiteUrl } = req.body;
    
    console.log(`Generating portal for: ${restaurantName}`);
    
    // Step 1: Generate restaurant data with AI
    const aiResult = await aiService.generateRestaurantData(restaurantName, websiteUrl);
    
    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate restaurant data'
      });
    }

    const { description, colors, menuItems } = aiResult.data;

    // Step 2: Create the portal
    const portalData = {
      name: restaurantName,
      description,
      userId,
      colors,
      status: 'draft',
      settings: {
        currency: 'USD',
        taxRate: 0.1,
        deliveryFee: 3.99,
        minOrderForFreeDelivery: 25.00
      }
    };

    const portal = await portalService.createPortal(portalData);

    // Step 3: Create menu items
    const createdMenuItems = [];
    for (const menuItemData of menuItems) {
      try {
        const menuItem = await menuService.createMenuItem({
          ...menuItemData,
          portalId: portal.id,
          image: `/images/fallback/${menuItemData.category.toLowerCase().replace(/\s+/g, '-')}.jpg`
        });
        createdMenuItems.push(menuItem);
      } catch (menuError) {
        console.error('Error creating menu item:', menuError);
        // Continue with other items even if one fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Restaurant portal generated successfully',
      data: {
        portal,
        menuItems: createdMenuItems,
        totalMenuItems: createdMenuItems.length
      }
    });
  } catch (error) {
    console.error('Error generating portal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate restaurant portal',
      error: error.message
    });
  }
});

// POST /api/ai/suggest-menu-items - Generate menu item suggestions
router.post('/suggest-menu-items', [
  body('category').notEmpty().withMessage('Category is required'),
  body('portalId').notEmpty().withMessage('Portal ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { category, portalId } = req.body;
    
    // Get existing menu items for this portal and category
    const existingItems = await menuService.getMenuItemsByCategory(portalId, category);
    
    // Generate suggestions
    const result = await aiService.generateMenuItemSuggestions(category, existingItems);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate menu suggestions'
      });
    }

    res.json({
      success: true,
      message: 'Menu suggestions generated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error generating menu suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate menu suggestions',
      error: error.message
    });
  }
});

// POST /api/ai/create-suggested-items - Create menu items from AI suggestions
router.post('/create-suggested-items', [
  body('portalId').notEmpty().withMessage('Portal ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.description').notEmpty().withMessage('Item description is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('items.*.category').notEmpty().withMessage('Category is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { portalId, items } = req.body;
    
    const createdItems = [];
    const errors = [];

    for (const itemData of items) {
      try {
        const menuItem = await menuService.createMenuItem({
          ...itemData,
          portalId,
          tags: itemData.tags || [],
          available: true,
          image: `/images/fallback/${itemData.category.toLowerCase().replace(/\s+/g, '-')}.jpg`
        });
        createdItems.push(menuItem);
      } catch (itemError) {
        console.error('Error creating suggested menu item:', itemError);
        errors.push({
          item: itemData.name,
          error: itemError.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdItems.length} menu items successfully`,
      data: {
        createdItems,
        errors: errors.length > 0 ? errors : undefined,
        totalCreated: createdItems.length,
        totalErrors: errors.length
      }
    });
  } catch (error) {
    console.error('Error creating suggested items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create suggested menu items',
      error: error.message
    });
  }
});

// POST /api/ai/chat - AI chatbot for restaurant assistance
router.post('/chat', [
  body('messages').isArray({ min: 1 }).withMessage('Messages array is required'),
  body('messages.*.role').isIn(['user', 'assistant']).withMessage('Valid message role is required'),
  body('messages.*.content').notEmpty().withMessage('Message content is required'),
  body('portalId').optional().isString().withMessage('Portal ID must be a string'),
  body('menuItems').optional().isArray().withMessage('Menu items must be an array'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { messages, portalId, menuItems } = req.body;

    console.log(`Processing chat request for portalId: ${portalId || 'none'}`);
    console.log(`Number of messages: ${messages.length}`);

    // Use the AI service to generate a chat response
    const result = await aiService.generateChatResponse(messages, portalId, menuItems);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate chat response'
      });
    }

    res.json({
      success: true,
      response: result.data.response
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request',
      error: error.message
    });
  }
});

module.exports = router;
