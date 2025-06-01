// @ts-nocheck
"use server";

import { apiClient } from "@/lib/api-client";
import { Order, OrderItem } from "@/types/index";
import { revalidatePath } from "next/cache";

// Type definitions for order actions
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'online';

// Create a new order
export async function createOrder(
  portalId: string,
  items: OrderItem[],
  customer: Order['customer'],
  options?: {
    paymentMethod?: PaymentMethod;
    table?: string;
  }
): Promise<Order> {
  try {
    const orderData = {
      portalId,
      items,
      customer,
      paymentMethod: options?.paymentMethod,
      table: options?.table
    };

    const newOrder = await apiClient.createOrder(orderData);

    // Revalidate the portal page to show the new order
    revalidatePath(`/portal/${portalId}`);
    revalidatePath(`/portal/${portalId}/cashier`);
    revalidatePath(`/portal/${portalId}/kitchen`);

    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Get all orders for a portal
export async function getPortalOrders(portalId: string): Promise<Order[]> {
  try {
    const orders = await apiClient.getPortalOrders(portalId);
    return orders;
  } catch (error) {
    console.error("Error fetching portal orders:", error);
    return [];
  }
}

// Get orders by status
export async function getOrdersByStatus(portalId: string, status: OrderStatus | 'all'): Promise<Order[]> {
  try {
    const options = status === 'all' ? {} : { status };
    const orders = await apiClient.getPortalOrders(portalId, options);
    return orders;
  } catch (error) {
    console.error(`Error fetching ${status} orders:`, error);
    return [];
  }
}

// Get a single order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const order = await apiClient.getOrderById(id);
    return order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
}

// Update order status
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  additionalData: Partial<Order> = {}
): Promise<Order | null> {
  try {
    const order = await apiClient.updateOrderStatus(id, status);

    if (order) {
      // Revalidate paths
      revalidatePath(`/portal/${order.portalId}`);
      revalidatePath(`/portal/${order.portalId}/cashier`);
      revalidatePath(`/portal/${order.portalId}/kitchen`);

      return order;
    }

    return null;
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}

// Process payment for an order
export async function processOrderPayment(
  id: string,
  paymentMethod: PaymentMethod,
  tip?: number
): Promise<Order | null> {
  try {
    // First update payment status to 'paid'
    await apiClient.updatePaymentStatus(id, 'paid');

    // Then update order status to 'confirmed' so it goes to kitchen
    const order = await apiClient.updateOrderStatus(id, 'confirmed');

    if (order) {
      // Revalidate paths
      revalidatePath(`/portal/${order.portalId}`);
      revalidatePath(`/portal/${order.portalId}/cashier`);
      revalidatePath(`/portal/${order.portalId}/kitchen`);

      return order;
    }

    return null;
  } catch (error) {
    console.error("Error processing payment:", error);
    return null;
  }
}

// Generate dummy orders for testing
export async function generateDummyOrders(portalId: string, count: number = 5): Promise<Order[]> {
  try {
    // Get menu items for this portal using API client
    const menuItems = await apiClient.getMenuItems(portalId);
    if (menuItems.length === 0) {
      throw new Error("No menu items found for this portal");
    }

    const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    const paymentMethods: PaymentMethod[] = ['card', 'cash', 'online'];
    const customerNames = [
      'John Smith', 'Emma Johnson', 'Michael Brown', 'Olivia Davis', 
      'William Wilson', 'Sophia Martinez', 'James Anderson', 'Isabella Taylor',
      'Robert Thomas', 'Ava Garcia', 'David Rodriguez', 'Mia Lopez'
    ];

    const dummyOrders: Order[] = [];

    for (let i = 0; i < count; i++) {
      // Generate random order items (1-4 items)
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const orderItems: OrderItem[] = [];
      
      for (let j = 0; j < itemCount; j++) {
        const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        orderItems.push({
          id: `item_${j}_${Date.now()}`,
          menuItemId: randomMenuItem.id,
          name: randomMenuItem.name,
          price: randomMenuItem.price,
          quantity,
          image: randomMenuItem.image,
          notes: Math.random() > 0.7 ? 'Special request: extra sauce' : undefined
        });
      }

      // Random customer
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const customer = {
        name: customerName,
        email: `${customerName.toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+1${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`,
        table: `Table ${Math.floor(Math.random() * 20) + 1}`
      };

      // Random status
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Create order with random time in the past (0-3 hours ago)
      const hoursAgo = Math.random() * 3;
      const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      
      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax
      const deliveryFee = 3.99;
      const tip = Math.random() > 0.5 ? Math.round(subtotal * 0.15 * 100) / 100 : 0; // 15% tip sometimes
      const total = subtotal + tax + deliveryFee + (tip || 0);

      // Create order using API client
      const orderData = {
        portalId,
        items: orderItems,
        customer,
        paymentMethod,
        table: customer.table
      };

      const newOrder = await apiClient.createOrder(orderData);
      dummyOrders.push(newOrder);
    }

    // Revalidate paths
    revalidatePath(`/portal/${portalId}`);
    revalidatePath(`/portal/${portalId}/cashier`);
    revalidatePath(`/portal/${portalId}/kitchen`);

    return dummyOrders;
  } catch (error) {
    console.error("Error generating dummy orders:", error);
    return [];
  }
}
