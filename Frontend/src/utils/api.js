// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5002/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // In case you want to support cookies (optional)
});

// Attach Authorization header for secure endpoints
api.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = ["/auth/register", "/auth/login", "/auth/forgot-password", "/auth/reset-password"].some(endpoint =>
      config.url.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example GET request for all events
export const fetchEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

// Example GET request for all users (Admin only)
export const fetchAllUsers = async () => {
  const response = await api.get("/auth/users"); // Adjusted to match your real backend route
  return response.data;
};

// Example POST login
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// Add more helpful API calls as needed...

export default api;
