// File: src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../utils/api"; // Your configured axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 'user' instead of 'currentUser' for consistency
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on app startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error("Error parsing user/token from localStorage:", err);
        setError("Failed to load user session");
      }
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { id, name, email: userEmail, role, token: receivedToken } = res.data;

      const userData = { id, name, email: userEmail, role };
      setUser(userData);
      setToken(receivedToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", receivedToken);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  // Register
  const register = async (formData) => {
    try {
      await api.post("/auth/register", formData);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError("Registration failed. Please try again.");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed (proceeding anyway)");
    } finally {
      setUser(null);
      setToken(null);
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
