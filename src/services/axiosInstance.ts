import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Type definition for Vite env variables
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_BASE_URL = (import.meta as unknown as ImportMeta).env.VITE_API_URL;
const API_VERSION = (import.meta as unknown as ImportMeta).env.VITE_API_VERSION;

// Construct the full API URL with version
const API_URL = `${API_BASE_URL}${API_VERSION}`;

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {},
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token if available
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage and add to headers if available
    // The API expects Authorization header with the token
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      // Use Bearer token format (standard for JWT tokens)
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If FormData is being sent, let Axios set the Content-Type automatically
    // This ensures the boundary is set correctly for multipart/form-data
    if (config.data instanceof FormData) {
      // Remove Content-Type header to let browser set it with boundary
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Only redirect if not already on login/signup page and not during initial auth check
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/signup' || currentPath === '/';
      const isAuthCheck = originalRequest?.url?.includes('/auth/info') || originalRequest?.url?.includes('/auth/info');
      
      // Clear stored auth data on 401
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Don't redirect during initial auth check or if already on auth page
      if (!isAuthCheck && !isAuthPage) {
        // Small delay to prevent rapid redirects
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }

    // Handle network errors
    if (!error.response) {
      // Network error - no response from server
      console.error('Network error:', error.message);
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    }

    if (error.response?.status === 500) {
      console.error('Server error: Please try again later');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
