// @ts-nocheck
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

export interface Order {
  _id?: ObjectId;
  id: string;
  portalId: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    table?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip?: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedReadyTime?: Date;
}

export function createNewOrder(
  portalId: string,
  items: OrderItem[],
  customer: Order['customer'],
  options?: {
    paymentMethod?: PaymentMethod;
    table?: string;
  }
): Order {
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
      table: options?.table,
    },
    items,
    subtotal,
    tax,
    deliveryFee,
    total,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: options?.paymentMethod,
    createdAt: now,
    updatedAt: now,
    estimatedReadyTime: new Date(now.getTime() + 20 * 60000), // 20 minutes from now
  };
}

// Convert MongoDB document to Order object
export function mapOrderDocument(doc: any): Order {
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
