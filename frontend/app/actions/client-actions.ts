// @ts-nocheck
"use client";

import { Order, OrderStatus, PaymentMethod } from "@/models/Order";
import { 
  createOrder as serverCreateOrder,
  getPortalOrders as serverGetPortalOrders,
  getOrdersByStatus as serverGetOrdersByStatus,
  getOrderById as serverGetOrderById,
  updateOrderStatus as serverUpdateOrderStatus,
  processOrderPayment as serverProcessOrderPayment,
  generateDummyOrders as serverGenerateDummyOrders
} from "./order-actions";

// Client-side wrapper for server actions
export async function createOrder(
  portalId: string,
  items: any[],
  customer: any,
  options?: {
    paymentMethod?: PaymentMethod;
    table?: string;
  }
): Promise<Order> {
  return serverCreateOrder(portalId, items, customer, options);
}

export async function getPortalOrders(portalId: string): Promise<Order[]> {
  return serverGetPortalOrders(portalId);
}

export async function getOrdersByStatus(portalId: string, status: OrderStatus | 'all'): Promise<Order[]> {
  return serverGetOrdersByStatus(portalId, status);
}

export async function getOrderById(id: string): Promise<Order | null> {
  return serverGetOrderById(id);
}

export async function updateOrderStatus(
  id: string, 
  status: OrderStatus,
  additionalData: Partial<Order> = {}
): Promise<Order | null> {
  return serverUpdateOrderStatus(id, status, additionalData);
}

export async function processOrderPayment(
  id: string,
  paymentMethod: PaymentMethod,
  tip?: number
): Promise<Order | null> {
  return serverProcessOrderPayment(id, paymentMethod, tip);
}

export async function generateDummyOrders(portalId: string, count: number = 5): Promise<Order[]> {
  return serverGenerateDummyOrders(portalId, count);
}
