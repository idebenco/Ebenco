import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profile) => {
    const response = await api.put('/auth/profile', { profile });
    return response.data;
  },
};

export const propertyService = {
  getProperties: async (params = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  getProperty: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

export const applicationService = {
  getApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getApplication: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  submitApplication: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  updateApplicationStatus: async (id, status, rejectionReason) => {
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

  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  processPayment: async (id, stripePaymentId) => {
    const response = await api.post(`/payments/${id}/process`, {
      stripePaymentId,
    });
    return response.data;
  },
};
