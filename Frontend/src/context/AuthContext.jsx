// 
import { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import React from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate token with backend on mount
  useEffect(() => {
    const validateSession = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Verify token with backend using the original /auth/check endpoint
          const res = await api.get("/auth/check", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setCurrentUser(parsedUser); // Assuming /auth/check returns user data or validates it
          setToken(storedToken);
        } catch (err) {
          console.error("Session validation failed:", err.response?.data || err.message);
          // Clear invalid session
          setCurrentUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setError("Session expired. Please log in again.");
        }
      }
      setLoading(false);
    };
    validateSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;
      if (!user || !token) {
        throw new Error("Invalid response from server: missing user or token");
      }
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      console.log("Login successful - currentUser:", user);
      return user; // Return user object for role-based redirection
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid credentials");
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const res = await api.post("/auth/register", formData);
      const { user, token } = res.data;
      if (!user || !token) {
        throw new Error("Invalid response from server: missing user or token");
      }
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post("/auth/logout", {}, { withCredentials: true });
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Logout failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        token,
        login,
        register,
        logout,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};