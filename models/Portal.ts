// @ts-nocheck
import { ObjectId } from "mongodb";

export interface Portal {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: "active" | "inactive" | "draft";
  userId: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo?: string;
  menuItems?: MenuItem[];
  settings?: {
    currency: string;
    taxRate?: number;
    deliveryFee?: number;
    minOrderForFreeDelivery?: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  tags: string[];
  available: boolean;
  portalId: string;
}

// Convert MongoDB document to Portal object
export function mapPortalDocument(doc: any): Portal {
  return {
    _id: doc._id,
    id: doc.id,
    name: doc.name,
    description: doc.description,
    createdAt: new Date(doc.createdAt),
    status: doc.status,
    userId: doc.userId,
    colors: doc.colors,
    logo: doc.logo,
    menuItems: doc.menuItems,
    settings: doc.settings,
  };
}

// Convert MongoDB document to MenuItem object
export function mapMenuItemDocument(doc: any): MenuItem {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category,
    tags: doc.tags,
    available: doc.available,
    portalId: doc.portalId,
  };
}
