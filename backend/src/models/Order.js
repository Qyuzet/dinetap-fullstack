const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// Order status types
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment method types
const PAYMENT_METHOD = {
  CARD: 'card',
  CASH: 'cash',
  ONLINE: 'online'
};

// Payment status types
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

// OrderItem schema
const OrderItemSchema = {
  id: String,
  menuItemId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  notes: String,
};

// Order schema
const OrderSchema = {
  _id: ObjectId,
  id: String,
  portalId: String,
  customer: {
    name: String,
    email: String,
    phone: String,
    table: String,
  },
  items: Array, // Array of OrderItem
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  tip: Number,
  total: Number,
  status: String, // ORDER_STATUS
  paymentMethod: String, // PAYMENT_METHOD
  paymentStatus: String, // PAYMENT_STATUS
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,
  estimatedReadyTime: Date,
};

// Create a new order
function createNewOrder(portalId, items, customer, options = {}) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = 3.99;
  const total = subtotal + tax + deliveryFee;
  
  const now = new Date();
  
  return {
    id: uuidv4(),
    portalId,
    customer: {
      ...customer,
      table: options.table,
    },
    items,
    subtotal,
    tax,
    deliveryFee,
    total,
    status: ORDER_STATUS.PENDING,
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMethod: options.paymentMethod,
    createdAt: now,
    updatedAt: now,
    estimatedReadyTime: new Date(now.getTime() + 20 * 60000), // 20 minutes from now
  };
}

// Convert MongoDB document to Order object
function mapOrderDocument(doc) {
  if (!doc) return null;
  
  return {
    _id: doc._id,
    id: doc.id,
    portalId: doc.portalId,
    customer: doc.customer,
    items: doc.items,
    subtotal: doc.subtotal,
    tax: doc.tax,
    deliveryFee: doc.deliveryFee,
    tip: doc.tip,
    total: doc.total,
    status: doc.status,
    paymentMethod: doc.paymentMethod,
    paymentStatus: doc.paymentStatus,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
    estimatedReadyTime: doc.estimatedReadyTime ? new Date(doc.estimatedReadyTime) : undefined,
  };
}

// Validation functions
function validateOrder(order) {
  const errors = [];
  
  if (!order.portalId || order.portalId.trim().length === 0) {
    errors.push('Portal ID is required');
  }
  
  if (!order.customer || !order.customer.name || order.customer.name.trim().length === 0) {
    errors.push('Customer name is required');
  }
  
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  if (typeof order.subtotal !== 'number' || order.subtotal < 0) {
    errors.push('Valid subtotal is required');
  }
  
  if (typeof order.total !== 'number' || order.total < 0) {
    errors.push('Valid total is required');
  }
  
  if (order.status && !Object.values(ORDER_STATUS).includes(order.status)) {
    errors.push('Invalid order status');
  }
  
  return errors;
}

function validateOrderItem(item) {
  const errors = [];
  
  if (!item.menuItemId || item.menuItemId.trim().length === 0) {
    errors.push('Menu item ID is required');
  }
  
  if (!item.name || item.name.trim().length === 0) {
    errors.push('Item name is required');
  }
  
  if (typeof item.price !== 'number' || item.price < 0) {
    errors.push('Valid price is required');
  }
  
  if (typeof item.quantity !== 'number' || item.quantity <= 0) {
    errors.push('Valid quantity is required');
  }
  
  return errors;
}

module.exports = {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  OrderSchema,
  OrderItemSchema,
  createNewOrder,
  mapOrderDocument,
  validateOrder,
  validateOrderItem,
};
