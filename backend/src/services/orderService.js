const { getDatabase } = require('../config/database');
const { 
  createNewOrder, 
  mapOrderDocument, 
  validateOrder,
  ORDER_STATUS,
  PAYMENT_STATUS 
} = require('../models/Order');

class OrderService {
  constructor() {
    this.collectionName = 'orders';
  }

  async createOrder(portalId, items, customer, options = {}) {
    try {
      const orderData = createNewOrder(portalId, items, customer, options);
      
      // Validate order data
      const validationErrors = validateOrder(orderData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const result = await ordersCollection.insertOne(orderData);
      
      if (!result.insertedId) {
        throw new Error('Failed to create order');
      }

      return mapOrderDocument(orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const order = await ordersCollection.findOne({ id });
      return mapOrderDocument(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('Failed to fetch order');
    }
  }

  async getOrdersByPortal(portalId, limit = 50, offset = 0) {
    try {
      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const orders = await ordersCollection
        .find({ portalId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .toArray();

      return orders.map(mapOrderDocument);
    } catch (error) {
      console.error('Error fetching orders by portal:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrdersByStatus(portalId, status) {
    try {
      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const orders = await ordersCollection
        .find({ portalId, status })
        .sort({ createdAt: -1 })
        .toArray();

      return orders.map(mapOrderDocument);
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw new Error('Failed to fetch orders by status');
    }
  }

  async updateOrderStatus(id, status) {
    try {
      if (!Object.values(ORDER_STATUS).includes(status)) {
        throw new Error('Invalid order status');
      }

      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const updateData = {
        status,
        updatedAt: new Date()
      };

      // If order is completed, set completedAt timestamp
      if (status === ORDER_STATUS.COMPLETED) {
        updateData.completedAt = new Date();
      }

      const result = await ordersCollection.updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Order not found');
      }

      const updatedOrder = await ordersCollection.findOne({ id });
      return mapOrderDocument(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id, paymentStatus) {
    try {
      if (!Object.values(PAYMENT_STATUS).includes(paymentStatus)) {
        throw new Error('Invalid payment status');
      }

      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const result = await ordersCollection.updateOne(
        { id },
        { 
          $set: { 
            paymentStatus,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Order not found');
      }

      const updatedOrder = await ordersCollection.findOne({ id });
      return mapOrderDocument(updatedOrder);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async getOrderStats(portalId, startDate, endDate) {
    try {
      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const matchQuery = { portalId };
      
      if (startDate && endDate) {
        matchQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const stats = await ordersCollection.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' },
            statusBreakdown: {
              $push: '$status'
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalOrders: 1,
            totalRevenue: { $round: ['$totalRevenue', 2] },
            averageOrderValue: { $round: ['$averageOrderValue', 2] },
            statusBreakdown: 1
          }
        }
      ]).toArray();

      return stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        statusBreakdown: []
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw new Error('Failed to fetch order statistics');
    }
  }

  async cancelOrder(id, reason = '') {
    try {
      const db = await getDatabase();
      const ordersCollection = db.collection(this.collectionName);

      const order = await ordersCollection.findOne({ id });
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === ORDER_STATUS.COMPLETED || order.status === ORDER_STATUS.CANCELLED) {
        throw new Error('Cannot cancel completed or already cancelled order');
      }

      const result = await ordersCollection.updateOne(
        { id },
        { 
          $set: { 
            status: ORDER_STATUS.CANCELLED,
            cancellationReason: reason,
            updatedAt: new Date()
          }
        }
      );

      const updatedOrder = await ordersCollection.findOne({ id });
      return mapOrderDocument(updatedOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();
