import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = 'http://10.25.143.17:3036/api';

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
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

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  notes?: string;
}

export interface Order {
  _id?: string;
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
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod?: 'card' | 'cash' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  estimatedReadyTime?: Date;
}

// Portal API
export const portalApi = {
  // Get user portals
  getUserPortals: async (userId: string, options?: { status?: string; search?: string }): Promise<Portal[]> => {
    const params = new URLSearchParams({ userId });
    if (options?.status) params.append('status', options.status);
    if (options?.search) params.append('search', options.search);

    const response = await httpClient.get<ApiResponse<Portal[]>>(`/portals?${params}`);
    return response.data.data || [];
  },

  // Get portal by ID
  getPortalById: async (id: string): Promise<Portal | null> => {
    try {
      const response = await httpClient.get<ApiResponse<Portal>>(`/portals/${id}`);
      return response.data.data || null;
    } catch (error) {
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create portal
  createPortal: async (portalData: Omit<Portal, 'id' | 'createdAt'>): Promise<Portal> => {
    const response = await httpClient.post<ApiResponse<Portal>>('/portals', portalData);
    return response.data.data!;
  },

  // Update portal
  updatePortal: async (id: string, portalData: Partial<Portal>): Promise<Portal> => {
    const response = await httpClient.put<ApiResponse<Portal>>(`/portals/${id}`, portalData);
    return response.data.data!;
  },

  // Delete portal
  deletePortal: async (id: string): Promise<void> => {
    await httpClient.delete(`/portals/${id}`);
  },

  // Get portal menu
  getPortalMenu: async (portalId: string, options?: { category?: string; search?: string }): Promise<MenuItem[]> => {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.search) params.append('search', options.search);

    const queryString = params.toString();
    const url = `/portals/${portalId}/menu${queryString ? `?${queryString}` : ''}`;

    const response = await httpClient.get<ApiResponse<MenuItem[]>>(url);
    return response.data.data || [];
  },

  // Get menu categories
  getMenuCategories: async (portalId: string): Promise<string[]> => {
    const response = await httpClient.get<ApiResponse<string[]>>(`/portals/${portalId}/categories`);
    return response.data.data || [];
  },
};

// Menu API
export const menuApi = {
  // Get menu item by ID
  getMenuItemById: async (id: string): Promise<MenuItem | null> => {
    try {
      const response = await httpClient.get<ApiResponse<MenuItem>>(`/menu/${id}`);
      return response.data.data || null;
    } catch (error) {
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create menu item
  createMenuItem: async (menuItemData: Omit<MenuItem, 'id' | 'createdAt'>): Promise<MenuItem> => {
    const response = await httpClient.post<ApiResponse<MenuItem>>('/menu', menuItemData);
    return response.data.data!;
  },

  // Update menu item
  updateMenuItem: async (id: string, menuItemData: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await httpClient.put<ApiResponse<MenuItem>>(`/menu/${id}`, menuItemData);
    return response.data.data!;
  },

  // Delete menu item
  deleteMenuItem: async (id: string): Promise<void> => {
    await httpClient.delete(`/menu/${id}`);
  },

  // Update menu item availability
  updateMenuItemAvailability: async (id: string, available: boolean): Promise<MenuItem> => {
    const response = await httpClient.patch<ApiResponse<MenuItem>>(`/menu/${id}/availability`, { available });
    return response.data.data!;
  },
};

// Order API
export const orderApi = {
  // Get orders for portal
  getPortalOrders: async (portalId: string, options?: { status?: string; limit?: number; offset?: number }): Promise<Order[]> => {
    const params = new URLSearchParams({ portalId });
    if (options?.status) params.append('status', options.status);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await httpClient.get<ApiResponse<Order[]>>(`/orders?${params}`);
    return response.data.data || [];
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const response = await httpClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return response.data.data || null;
    } catch (error) {
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData: {
    portalId: string;
    items: OrderItem[];
    customer: Order['customer'];
    paymentMethod?: string;
    table?: string;
  }): Promise<Order> => {
    const response = await httpClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data!;
  },

  // Update order status
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await httpClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data.data!;
  },

  // Update payment status
  updatePaymentStatus: async (id: string, paymentStatus: Order['paymentStatus']): Promise<Order> => {
    const response = await httpClient.patch<ApiResponse<Order>>(`/orders/${id}/payment`, { paymentStatus });
    return response.data.data!;
  },

  // Cancel order
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await httpClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
    return response.data.data!;
  },

  // Get order statistics
  getOrderStats: async (portalId: string, options?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);

    const queryString = params.toString();
    const url = `/orders/stats/${portalId}${queryString ? `?${queryString}` : ''}`;

    const response = await httpClient.get<ApiResponse<any>>(url);
    return response.data.data;
  },
};

// AI API
export const aiApi = {
  // Analyze restaurant
  analyzeRestaurant: async (restaurantName: string, websiteUrl?: string) => {
    const response = await httpClient.post<ApiResponse<any>>('/ai/analyze-restaurant', {
      restaurantName,
      websiteUrl,
    });
    return response.data.data;
  },

  // Generate complete portal
  generatePortal: async (restaurantName: string, userId: string, websiteUrl?: string) => {
    const response = await httpClient.post<ApiResponse<any>>('/ai/generate-portal', {
      restaurantName,
      userId,
      websiteUrl,
    });
    return response.data.data;
  },

  // Get menu suggestions
  getMenuSuggestions: async (category: string, portalId: string) => {
    const response = await httpClient.post<ApiResponse<any>>('/ai/suggest-menu-items', {
      category,
      portalId,
    });
    return response.data.data;
  },

  // Create suggested items
  createSuggestedItems: async (portalId: string, items: any[]) => {
    const response = await httpClient.post<ApiResponse<any>>('/ai/create-suggested-items', {
      portalId,
      items,
    });
    return response.data.data;
  },
};

// Unified API client for actions.ts compatibility
export const unifiedApiClient = {
  // Portal methods
  getPortals: portalApi.getUserPortals,
  getPortal: portalApi.getPortalById,
  createPortal: portalApi.createPortal,
  updatePortal: portalApi.updatePortal,
  deletePortal: portalApi.deletePortal,

  // Menu methods
  getMenuItems: portalApi.getPortalMenu,
  createMenuItem: menuApi.createMenuItem,
  updateMenuItem: menuApi.updateMenuItem,
  deleteMenuItem: menuApi.deleteMenuItem,

  // Order methods
  getPortalOrders: orderApi.getPortalOrders,
  getOrderById: orderApi.getOrderById,
  createOrder: orderApi.createOrder,
  updateOrderStatus: orderApi.updateOrderStatus,
  updatePaymentStatus: orderApi.updatePaymentStatus,
  cancelOrder: orderApi.cancelOrder,

  // AI methods
  generateRestaurant: aiApi.generatePortal,
  analyzeRestaurant: aiApi.analyzeRestaurant,
};

// Export the unified client as apiClient for actions.ts
export { unifiedApiClient as apiClient };

export default unifiedApiClient;
