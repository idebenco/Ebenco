import api from './api';
import { AuthResponse, Product } from '../types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  businessName?: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const productService = {
  getAll: async (params?: { category?: string; search?: string; available?: boolean }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const orderService = {
  getAll: async (params?: { status?: string }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: {
    items: { productId: string; quantity: number }[];
    deliveryAddress: { street: string; city: string; state: string; zipCode: string };
    notes?: string;
  }) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    name: string;
    phone: string;
    businessName: string;
    address: { street: string; city: string; state: string; zipCode: string };
  }>) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
