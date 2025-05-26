import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import "./AuthForm.css";
import React from 'react';

export default function ForgotPassword() {
  const { token } = useParams(); // Get token from URL for reset password
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle submitting the forgot password request
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required");
      toast.error("Email is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Invalid email format");
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      await api.post("/users/forgot-password", { email: trimmedEmail });
      setMessage("Password reset link sent to your email.");
      toast.success("Password reset link sent!");
      setEmail(""); // Clear the email field after success
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send reset link.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle submitting the reset password form
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Client-side validation
    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      toast.error("Both password fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.put(`/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      toast.success(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Determine which form to render based on the presence of a token
  const isResetPassword = !!token;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Toaster />
      <div className="form-container" style={{ flex: 1 }}>
        <h2>{isResetPassword ? "Reset Password" : "Forgot Password"}</h2>
        {error && <p className="error">{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {isResetPassword ? (
          <form onSubmit={handleResetPasswordSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        <p style={{ fontSize: "14px", marginTop: "10px" }}>
          Back to{" "}
          <Link to="/login" style={{ color: "#0077ff" }}>
            Login
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}