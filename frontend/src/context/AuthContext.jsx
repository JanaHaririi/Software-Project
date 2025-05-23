import { createContext, useState, useEffect } from "react";
import api from "../utils/api"; // Make sure this points to your axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: for showing errors

  // Load user from localStorage when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        // Safely parse stored user and token
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        setError("Failed to load user data");
      }
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // Check if response has user and token
      const { user, token } = res.data;

      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Invalid credentials");
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      await api.post("/auth/register", formData);
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      setError("Registration failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setCurrentUser(null);
      setToken(null);
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        register,
        logout,
        loading,
        error, // Optional: for error handling
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
