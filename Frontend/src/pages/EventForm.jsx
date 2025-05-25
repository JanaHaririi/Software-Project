import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import React from 'react';


export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    ticketCount: 0,
    ticketPrice: 0,
    status: "pending", // Default status as per Task 2
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const res = await api.get(`/api/v1/events/${id}`);
          const event = res.data;
          setFormData({
            title: event.title,
            description: event.description,
            date: new Date(event.date).toISOString().split("T")[0],
            location: event.location,
            category: event.category,
            ticketCount: event.totalTickets || 0,
            ticketPrice: event.ticketPrice || 0,
            status: event.status || "pending",
          });
        } catch (err) {
          setError(`Failed to fetch event details: ${err.response?.data?.message || err.message}`);
          console.error("Fetch error:", err);
        }
      };
      fetchEvent();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "ticketCount" || name === "ticketPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!formData.title || !formData.description || !formData.date || !formData.location || !formData.category || formData.ticketCount <= 0 || formData.ticketPrice <= 0) {
      setError("All fields are required, and ticket count/price must be greater than 0.");
      return;
    }

    try {
      console.log("Submitting form data:", formData); // Log the data being sent
      if (id) {
        const res = await api.put(`/api/v1/events/${id}`, formData);
        setSuccess("Event updated successfully!");
      } else {
        const res = await api.post("/api/v1/events", formData);
        setSuccess("Event created successfully!");
        // Reset form after successful creation
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          category: "",
          ticketCount: 0,
          ticketPrice: 0,
          status: "pending",
        });
      }
      setTimeout(() => navigate("/my-events"), 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save event. Please check your input or contact support.";
      setError(errorMessage);
      console.error("Submission error:", err.response?.data || err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2>{id ? "Edit Event" : "Create Event"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="">Select Category</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Total Tickets:</label>
            <input
              type="number"
              name="ticketCount"
              value={formData.ticketCount}
              onChange={handleChange}
              required
              min="1"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Ticket Price:</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: "0.5rem 1rem", backgroundColor: "#0077ff", color: "white", border: "none" }}
          >
            {id ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}