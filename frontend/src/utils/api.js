// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Adjust to your backend URL
  withCredentials: true, // Include cookies in requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;