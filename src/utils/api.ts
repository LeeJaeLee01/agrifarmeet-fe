import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store';

// const BASE_URL = 'http://localhost:3030';
const BASE_URL = 'https://phungduccuong.site/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor cho request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  // Mặc định KHÔNG gắn token
  // Nếu muốn gắn thì khi gọi API phải set headers.Authorization = true
  if (token && config.headers?.Authorization === true) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers?.Authorization; // xoá nếu không dùng
  }

  return config;
});

type ApiResponse<T> = Promise<AxiosResponse<T>>;

const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): ApiResponse<T> => api.get(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): ApiResponse<T> =>
    api.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): ApiResponse<T> =>
    api.put(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): ApiResponse<T> =>
    api.delete(url, config),
};

export default request;
