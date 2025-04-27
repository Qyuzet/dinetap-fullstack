// @ts-nocheck
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  restaurants: ObjectId[];
}

export interface UserWithRestaurants extends User {
  restaurants: Restaurant[];
}

export interface Restaurant {
  _id?: ObjectId;
  name: string;
  description?: string;
  logo?: string;
  websiteUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  ownerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  menus: ObjectId[];
  settings: RestaurantSettings;
}

export interface RestaurantSettings {
  currency: string;
  taxRate: number;
  deliveryFee: number;
  minOrderForFreeDelivery?: number;
  openingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  location?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface MenuItem {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  tags: string[];
  available: boolean;
  popular?: boolean;
  spiceLevel?: 1 | 2 | 3 | null;
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  preparationTime?: number;
  options?: {
    name: string;
    required: boolean;
    multiple: boolean;
    choices: {
      name: string;
      price: number;
    }[];
  }[];
  restaurantId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id?: ObjectId;
  restaurantId: ObjectId;
  customerId?: ObjectId;
  items: {
    itemId: ObjectId;
    name: string;
    price: number;
    quantity: number;
    options?: {
      name: string;
      choices: {
        name: string;
        price: number;
      }[];
    }[];
    specialInstructions?: string;
  }[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip?: number;
  total: number;
  paymentMethod: 'card' | 'cash' | 'online';
  paymentStatus: 'pending' | 'completed' | 'failed';
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
}
