// src/pages/RegisterForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "./RegisterForm.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }

    try {
      await register(formData);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <Navbar />
      <div className="register-form">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">Standard User</option>
              <option value="organizer">Event Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}