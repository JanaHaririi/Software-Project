import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Correct base URL
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchEvents = async () => {
  const response = await api.get('/events'); // Resolves to /api/v1/events
  return response.data;
};

export const fetchAllEvents = async () => {
  const response = await api.get('/events/all'); // Resolves to /api/v1/events/all
  return response.data;
};

export default api;