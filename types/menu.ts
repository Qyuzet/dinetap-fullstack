export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'Appetizers' | 'Main Courses' | 'Sides' | 'Desserts' | 'Drinks'
  cuisine: 'American' | 'Italian' | 'Asian' | 'Mediterranean' | 'Mexican' | 'Indian' | 'French' | 'Japanese' | 'Chinese'
  tags: string[]
  popular: boolean
  spiceLevel?: 1 | 2 | 3 | null
  allergens?: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  preparationTime: number
}

export type MenuCategory = {
  id: string
  name: string
  description: string
  image: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  items: {
    item: MenuItem
    quantity: number
    specialInstructions?: string
  }[]
  status: OrderStatus
  subtotal: number
  tax: number
  tip?: number
  total: number
  createdAt: Date
  estimatedDeliveryTime?: Date
  customerDetails?: {
    name: string
    email: string
    phone: string
    address?: string
  }
  paymentMethod: 'card' | 'cash' | 'online'
  paymentStatus: 'pending' | 'completed' | 'failed'
}

export type ComplaintCategory = 
  | 'food-quality' 
  | 'service' 
  | 'delivery' 
  | 'app-issues' 
  | 'billing' 
  | 'other'

export type Complaint = {
  id: string
  category: ComplaintCategory
  description: string
  orderId?: string
  customerDetails: {
    name: string
    email: string
    phone?: string
  }
  createdAt: Date
  status: 'submitted' | 'in-review' | 'resolved'
  resolved?: boolean
  resolvedAt?: Date
  response?: string
}