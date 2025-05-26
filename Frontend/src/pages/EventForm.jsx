import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import React from 'react';
import toast, { Toaster } from "react-hot-toast";
import "./EventForm.css";

export default function EventForm() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    ticketPrice: "0", // ✅ Correct field name
    totalTickets: "1",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"];

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (id) {
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/events/${id}`);
          setFormData({
            title: res.data.title,
            description: res.data.description,
            date: new Date(res.data.date).toISOString().split('T')[0],
            location: res.data.location,
            ticketPrice: res.data.ticketPrice.toString(), // ✅ Ensure it's a string for input
            totalTickets: res.data.totalTickets.toString(),
            category: res.data.category || "",
            image: res.data.image || "",
          });
        } catch (err) {
          setError("Failed to fetch event data.");
          toast.error("Failed to fetch event data.");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, currentUser, navigate]);

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

    // Validate: Prevent submitting if ticketPrice or totalTickets are empty
    if (!formData.ticketPrice || !formData.totalTickets) {
      setError("Please enter a valid ticket price and total tickets.");
      return;
    }

    console.log("Form data to submit:", formData);

    try {
      const dataToSend = {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets),
      };

      if (!currentUser) {
        navigate("/login");
        return;
      }

      if (id) {
        await api.put(`/events/${id}`, dataToSend);
        toast.success("Event updated successfully!");
      } else {
        await api.post("/events", dataToSend);
        toast.success("Event created successfully!");
      }

      navigate("/my-events");
    } catch (err) {
      console.error("Error creating/updating event:", err.response?.data || err.message);
      setError(`Request failed: ${err.response?.data?.message || "Unknown error"}`);
      toast.error(`Failed to ${id ? "update" : "create"} event.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="event-form-container">
      <Navbar />
      <Toaster />
      <div className="event-form">
        <h2>{id ? "Edit Event" : "Create Event"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Ticket Price:</label> {/* ✅ Correct label */}
            <input
              type="number"
              name="ticketPrice" // ✅ Correct field name
              value={formData.ticketPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Total Tickets:</label>
            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Image URL (optional):</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>
          <button type="submit" disabled={loading}>
            {id ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
