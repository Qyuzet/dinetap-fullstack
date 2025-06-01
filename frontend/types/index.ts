export type User = {
  id: string
  name: string
  email: string
  phone?: string
  addresses?: {
    id: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    isDefault: boolean
  }[]
  preferences?: {
    favoriteItems?: string[]
    dietaryRestrictions?: string[]
    spicePreference?: 'mild' | 'medium' | 'hot'
  }
}

export type Route = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface Portal {
  _id?: string;
  id: string;
  name: string;
  description: string;
  userId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  status: 'active' | 'inactive' | 'draft';
  settings: {
    currency: string;
    taxRate: number;
    deliveryFee: number;
    minOrderForFreeDelivery: number;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  available: boolean;
  portalId: string;
  createdAt?: Date;
  updatedAt?: Date;
}