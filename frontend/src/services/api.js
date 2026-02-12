import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Genset API
export const gensetAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.condition) params.append('condition', filters.condition);
    if (filters.phase) params.append('phase', filters.phase);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
    if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity);
    
    return api.get(`/gensets?${params.toString()}`);
  },
  getById: (id) => api.get(`/gensets/${id}`),
  create: (data) => api.post('/gensets', data),
  update: (id, data) => api.put(`/gensets/${id}`, data),
  delete: (id) => api.delete(`/gensets/${id}`),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (filters = {}) => api.get('/orders', { params: filters }),
  getById: (id) => api.get(`/orders/${id}`),
  getCustomerOrders: (customerId) => api.get(`/orders/customer/${customerId}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  updatePayment: (id, paymentData) => api.patch(`/orders/${id}/payment`, paymentData),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
};

// Service Request API
export const serviceAPI = {
  create: (data) => api.post('/service-requests', data),
  getAll: (filters = {}) => api.get('/service-requests', { params: filters }),
  getById: (id) => api.get(`/service-requests/${id}`),
  getCustomerRequests: (customerId) => api.get(`/service-requests/customer/${customerId}`),
  assignTechnician: (id, technicianId) => api.patch(`/service-requests/${id}/assign`, { technicianId }),
  updateStatus: (id, status) => api.patch(`/service-requests/${id}/status`, { status }),
  complete: (id, completionData) => api.patch(`/service-requests/${id}/complete`, completionData),
  addFeedback: (id, feedback) => api.patch(`/service-requests/${id}/feedback`, feedback),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
  getLowStock: (threshold = 10) => api.get(`/low-stock?threshold=${threshold}`),
  getSalesReport: (filters = {}) => api.get('/reports/sales', { params: filters }),
  getServiceReport: (filters = {}) => api.get('/reports/service', { params: filters }),
};

export default api;
