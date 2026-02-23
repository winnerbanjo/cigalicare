import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001';
const API_BASE_URL = `${API_URL.replace(/\/$/, '')}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cigali_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
