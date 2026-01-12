import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const adminService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};

export const propertyService = {
  getProperties: async (params = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  getProperty: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

export const applicationService = {
  getApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  updateApplicationStatus: async (
    id: string,
    status: string,
    rejectionReason?: string
  ) => {
    const response = await api.put(`/applications/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },
};

export const paymentService = {
  getPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getPayment: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPaymentIntent: async (paymentId: string) => {
    const response = await api.post('/payments/create-intent', { paymentId });
    return response.data;
  },

  confirmPayment: async (paymentId: string, paymentMethodDetails: any) => {
    const response = await api.post(`/payments/${paymentId}/confirm`, paymentMethodDetails);
    return response.data;
  },

  refundPayment: async (paymentId: string, amount?: number, reason?: string) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { amount, reason });
    return response.data;
  },

  getReceipt: async (paymentId: string) => {
    const response = await api.get(`/payments/${paymentId}/receipt`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/payments/statistics');
    return response.data;
  },
};
