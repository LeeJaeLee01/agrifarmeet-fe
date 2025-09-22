import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
}

const BASE_URL = 'http://localhost:3030';
// const BASE_URL = 'https://phungduccuong.site/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor cho request
api.interceptors.request.use((config: InternalAxiosRequestConfig & { withAuth?: boolean }) => {
  const token = store.getState().auth.token;

  if (token && config.withAuth) {
    if (!config.headers) {
      config.headers = {} as import('axios').AxiosRequestHeaders;
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

type ApiResponse<T> = Promise<AxiosResponse<T>>;

const request = {
  get: <T = any>(url: string, config?: CustomAxiosRequestConfig): ApiResponse<T> =>
    api.get(url, config),

  post: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig): ApiResponse<T> =>
    api.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig): ApiResponse<T> =>
    api.put(url, data, config),

  delete: <T = any>(url: string, config?: CustomAxiosRequestConfig): ApiResponse<T> =>
    api.delete(url, config),
};

export default request;
