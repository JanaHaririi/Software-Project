import { createContext, useState, useEffect } from "react";
import api from "../utils/api"; // Your Axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    try {
      if (user && user !== "undefined") {
        setCurrentUser(JSON.parse(user));
        setToken(token);
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;

      setCurrentUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return user; // return for redirect
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Invalid credentials");
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      await api.post("/auth/register", formData);
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
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, token, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
