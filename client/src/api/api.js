import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:3001'; // Target port (Backend)

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add JWT token if available
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

// Response interceptor to handle errors (e.g., 401 Unauthorized) and provide unified feedback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'A network error occurred. Please verify your connection.';

    if (status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on the login page to avoid loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        toast.error('Session expired. Re-authorizing...', { id: 'auth-error' });
      }
    } else if (status === 403) {
      toast.error('Permission denied: Unauthorized access attempt.');
    } else if (status >= 500) {
      toast.error('System failure. Our engineers have been notified.');
    }

    return Promise.reject(error);
  }
);

export default api;