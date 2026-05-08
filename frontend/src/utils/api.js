import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('minis_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getFeaturedProducts = () => API.get('/products/featured');
export const getProduct = (id) => API.get(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);

// Contact
export const sendContact = (data) => API.post('/contact', data);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminProducts = (params) => API.get('/admin/products', { params });
export const createAdminProduct = (data) => API.post('/admin/products', data);
export const updateAdminProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteAdminProduct = (id) => API.delete(`/admin/products/${id}`);
export const getAdminOrders = (params) => API.get('/admin/orders', { params });
export const updateAdminOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });
export const deleteAdminOrder = (id) => API.delete(`/admin/orders/${id}`);
export const getAdminUsers = (params) => API.get('/admin/users', { params });
export const updateAdminUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
