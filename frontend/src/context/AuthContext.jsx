import { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import React from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && storedToken) {
          setCurrentUser(parsedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        setError("Failed to load user data");
      }
    }
    setLoading(false);
    // Removed repetitive debug log
  }, []); // Only run on component mount

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;
      if (!user || !token) {
        throw new Error("Invalid response from server: missing user or token");
      }
      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Invalid credentials");
      throw error;
    }
  };

  const register = async (formData) => {
    try {
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
      setError("Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setCurrentUser(null);
      setToken(null);
      localStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      setError("Logout failed");
      throw error;
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
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
