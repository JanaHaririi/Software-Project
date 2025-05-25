import axios from "axios";

// Use REACT_APP_API_BASE_URL if set, fallback to localhost:5002
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5002/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach Authorization header for secure endpoints
api.interceptors.request.use((config) => {
  const isPublicEndpoint = ["/auth/register", "/auth/login"].some(endpoint =>
    config.url.includes(endpoint)
  );

  if (!isPublicEndpoint) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Optionally, export helpful API calls
export const fetchEvents = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const fetchAllEvents = async () => {
  const response = await api.get("/events/all");
  return response.data;
};

export default api;
