import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import React from 'react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setError("Please log in to view your profile.");
        return;
      }

      try {
        const res = await api.get("/users/profile");
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
        });
        setCurrentUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
        toast.error(err.response?.data?.message || "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [currentUser, setCurrentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("All fields are required");
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      const res = await api.put("/users/profile", {
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      setCurrentUser(res.data);
      setSuccess("Profile updated successfully.");
      toast.success("Profile updated successfully.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ flex: 1, padding: "2rem", textAlign: "center" }}>
          <p>Please log in to view your profile.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Toaster />
      <div style={{ flex: 1, padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Profile</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: loading ? "#ccc" : "#0077ff",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
