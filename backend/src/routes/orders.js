const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
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

// GET /api/orders - Get orders for a portal
router.get('/', [
  query('portalId').notEmpty().withMessage('Portal ID is required'),
  query('status').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { portalId, status, limit = 50, offset = 0 } = req.query;
    
    let orders;
    if (status) {
      orders = await orderService.getOrdersByStatus(portalId, status);
    } else {
      orders = await orderService.getOrdersByPortal(portalId, parseInt(limit), parseInt(offset));
    }

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get a specific order
router.get('/:id', [
  param('id').notEmpty().withMessage('Order ID is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// POST /api/orders - Create a new order
router.post('/', [
  body('portalId').notEmpty().withMessage('Portal ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').optional().isEmail().withMessage('Valid email is required'),
  body('customer.phone').optional().isString(),
  body('paymentMethod').optional().isIn(['card', 'cash', 'online']),
  body('table').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { portalId, items, customer, paymentMethod, table } = req.body;
    
    const order = await orderService.createOrder(portalId, items, customer, {
      paymentMethod,
      table
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', [
  param('id').notEmpty().withMessage('Order ID is required'),
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
    .withMessage('Invalid order status'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await orderService.updateOrderStatus(id, status);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// PATCH /api/orders/:id/payment - Update payment status
router.patch('/:id/payment', [
  param('id').notEmpty().withMessage('Order ID is required'),
  body('paymentStatus').isIn(['pending', 'paid', 'failed'])
    .withMessage('Invalid payment status'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    const order = await orderService.updatePaymentStatus(id, paymentStatus);

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
});

// POST /api/orders/:id/cancel - Cancel an order
router.post('/:id/cancel', [
  param('id').notEmpty().withMessage('Order ID is required'),
  body('reason').optional().isString(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const order = await orderService.cancelOrder(id, reason);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// GET /api/orders/stats/:portalId - Get order statistics
router.get('/stats/:portalId', [
  param('portalId').notEmpty().withMessage('Portal ID is required'),
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { portalId } = req.params;
    const { startDate, endDate } = req.query;
    
    const stats = await orderService.getOrderStats(portalId, startDate, endDate);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
});

module.exports = router;
