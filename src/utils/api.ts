import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: 'http://localhost:3030', // thay bằng API thật
});

// interceptor chạy trước mỗi request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // lấy token từ redux

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // gắn token vào header
  }

  return config;
});

export default api;
