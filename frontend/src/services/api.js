import axios from 'axios';

// Base API configuration with fallback to direct backend URL if needed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred. Please try again.';

    // If 401 unauthorized, user token might be expired
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Don't auto-redirect if already attempting to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
};

// Category Services
export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};

// Service Services
export const serviceService = {
  getAll: async (search = '', categoryId = '') => {
    const params = {};
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    const res = await api.get('/services', { params });
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/services/${id}`);
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post('/services', data);
    return res.data.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/services/${id}`, data);
    return res.data.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/services/${id}`);
    return res.data;
  },
};

// Provider Services
export const providerService = {
  getAll: async () => {
    const res = await api.get('/providers');
    return res.data.data;
  },
  getByService: async (serviceId) => {
    const res = await api.get(`/providers/service/${serviceId}`);
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/providers/${id}`);
    return res.data.data;
  },
};

// Booking Services
export const bookingService = {
  create: async (data) => {
    const res = await api.post('/bookings', data);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },
  getCustomerBookings: async () => {
    const res = await api.get('/bookings/customer');
    return res.data.data;
  },
  getProviderBookings: async () => {
    const res = await api.get('/bookings/provider');
    return res.data.data;
  },
  getAllBookings: async () => {
    const res = await api.get('/bookings');
    return res.data.data;
  },
  accept: async (id) => {
    const res = await api.put(`/bookings/${id}/accept`);
    return res.data;
  },
  reject: async (id) => {
    const res = await api.put(`/bookings/${id}/reject`);
    return res.data;
  },
  complete: async (id) => {
    const res = await api.put(`/bookings/${id}/complete`);
    return res.data;
  },
  cancel: async (id) => {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data;
  },
};

// Payment Services
export const paymentService = {
  createPayment: async (bookingId, amount) => {
    const res = await api.post('/payments', { bookingId, amount });
    return res.data;
  },
  getByBooking: async (bookingId) => {
    const res = await api.get(`/payments/booking/${bookingId}`);
    return res.data.data;
  },
};

// Review Services
export const reviewService = {
  createReview: async (bookingId, rating, comment) => {
    const res = await api.post('/reviews', { bookingId, rating, comment });
    return res.data;
  },
  getByProvider: async (providerId) => {
    const res = await api.get(`/reviews/provider/${providerId}`);
    return res.data.data;
  },
};

// Notification Services
export const notificationService = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data.data;
  },
  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
};

// Admin Services
export const userService = {
  getAll: async () => {
    const res = await api.get('/users');
    return res.data.data;
  },
};

export default api;
