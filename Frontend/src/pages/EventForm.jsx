// src/pages/EventForm.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import { toast } from "react-toastify";
import React from 'react';


export default function EventForm() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams(); // For editing existing events
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    totalTickets: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch event data for editing
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/events/${id}`);
          setFormData(res.data);
        } catch (err) {
          setError("Failed to fetch event data.");
          toast.error("Failed to fetch event data.");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id]);

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
    setLoading(true);

    try {
      if (id) {
        // Update existing event
        await api.put(`/api/v1/events/${id}`, formData);
        toast.success("Event updated successfully!");
      } else {
        // Create new event
        await api.post("/api/v1/events", { ...formData, organizerId: currentUser.id });
        toast.success("Event created successfully!");
      }
      navigate("/my-events");
    } catch (err) {
      setError(`Request failed with status code ${err.response?.status || "unknown"}`);
      toast.error(`Failed to ${id ? "update" : "create"} event.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2>{id ? "Edit Event" : "Create Event"}</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
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
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Total Tickets:</label>
            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#0077ff", color: "white", border: "none", borderRadius: "4px" }}>
            {id ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}