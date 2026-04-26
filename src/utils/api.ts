import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { RootState, store } from '../store';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
}

// Configure API base URL based on environment
// Priority: REACT_APP_API_URL env variable > NODE_ENV auto detection
// Local development: http://localhost:3030
// Production: /api (will be proxied by nginx to http://127.0.0.1:3030/api/)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3030');

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor cho request — ưu tiên adminToken cho route /admin; fallback Redux token
api.interceptors.request.use((config: InternalAxiosRequestConfig & { withAuth?: boolean }) => {
  const isAdminRoute =
    config.url?.startsWith('/admin') || 
    config.url?.startsWith('/users/shippers') ||
    config.url?.startsWith('/foods');
  const adminToken = localStorage.getItem('adminToken');
  const stateToken = (store.getState() as RootState).auth.token;
  const token = isAdminRoute ? adminToken || stateToken : stateToken || adminToken;

  if (token && config.withAuth) {
    if (!config.headers) {
      config.headers = {} as import('axios').AxiosRequestHeaders;
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

type ApiResponse<T> = Promise<AxiosResponse<T>>;

export interface ApiRequest {
  get: <T = any>(url: string, config?: CustomAxiosRequestConfig) => ApiResponse<T>;
  post: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) => ApiResponse<T>;
  put: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) => ApiResponse<T>;
  patch: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) => ApiResponse<T>;
  delete: <T = any>(url: string, config?: CustomAxiosRequestConfig) => ApiResponse<T>;
}

const request: ApiRequest = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
};

export default request;
