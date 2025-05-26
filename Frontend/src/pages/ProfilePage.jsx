import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import React from 'react';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Correct endpoint and method for updating profile
      const res = await api.put("/users/profile", formData);
      setCurrentUser(res.data);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
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
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#0077ff", color: "white", border: "none" }}>
            Update Profile
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
