import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Users API calls
export const getUsers = async (filters = {}) => {
  try {
    const response = await api.get('/users', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create user' };
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update password' };
  }
};

// Stores API calls
export const getStores = async (searchParams = {}) => {
  try {
    const response = await api.get('/stores', { params: searchParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stores' };
  }
};

export const getStoreById = async (id) => {
  try {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch store' };
  }
};

export const createStore = async (storeData) => {
  try {
    const response = await api.post('/stores', storeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create store' };
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/stores/stats/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
  }
};

export const getStoreOwnerDashboard = async () => {
  try {
    const response = await api.get('/stores/owner/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch store owner dashboard' };
  }
};

// Ratings API calls
export const submitRating = async (ratingData) => {
  try {
    const response = await api.post('/ratings', ratingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit rating' };
  }
};

export const updateRating = async (ratingId, ratingData) => {
  try {
    const response = await api.put(`/ratings/${ratingId}`, ratingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update rating' };
  }
};

export const getStoreRatings = async (storeId, params = {}) => {
  try {
    const response = await api.get(`/ratings/store/${storeId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch store ratings' };
  }
};

export default api;