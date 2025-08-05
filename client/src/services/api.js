import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify-token'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Accounts API
export const accountsAPI = {
  getAccounts: (params) => api.get('/accounts', { params }),
  getAccount: (id) => api.get(`/accounts/${id}`),
  createAccount: (accountData) => api.post('/accounts', accountData),
  updateAccount: (id, accountData) => api.put(`/accounts/${id}`, accountData),
  deleteAccount: (id) => api.delete(`/accounts/${id}`),
  syncAccount: (id) => api.post(`/accounts/${id}/sync`),
  bulkUpdateAccounts: (data) => api.patch('/accounts/bulk-update', data),
};

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  publishPost: (id) => api.post(`/posts/${id}/publish`),
  duplicatePost: (id) => api.post(`/posts/${id}/duplicate`),
  getScheduledPosts: (params) => api.get('/posts/scheduled/upcoming', { params }),
};

// Bulk Operations API
export const bulkAPI = {
  importAccounts: (data) => api.post('/bulk/import-accounts', data),
  updateAccounts: (data) => api.patch('/bulk/update-accounts', data),
  deleteAccounts: (data) => api.delete('/bulk/delete-accounts', data),
  createPosts: (data) => api.post('/bulk/create-posts', data),
  applyTemplate: (data) => api.post('/bulk/apply-template', data),
  exportAccounts: (params) => api.get('/bulk/export-accounts', { params }),
};

// Analytics API
export const analyticsAPI = {
  getAccountAnalytics: (accountId, params) => 
    api.get(`/analytics/account/${accountId}`, { params }),
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Templates API
export const templatesAPI = {
  getTemplates: (params) => api.get('/templates', { params }),
  getTemplate: (id) => api.get(`/templates/${id}`),
  createTemplate: (templateData) => api.post('/templates', templateData),
  updateTemplate: (id, templateData) => api.put(`/templates/${id}`, templateData),
  deleteTemplate: (id) => api.delete(`/templates/${id}`),
};

export default api;