import axios from 'axios';

const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) 
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
