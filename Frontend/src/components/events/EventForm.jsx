// src/components/events/EventForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    ticketCount: 0,
    price: 0,
  });

  useEffect(() => {
    if (isEditing) {
      axios.get(`/api/events/${id}`).then(res => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/events/${id}`, form);
      } else {
        await axios.post("/api/events", form);
      }
      navigate("/my-events");
    } catch (err) {
      alert("Event submission failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
      <input name="ticketCount" type="number" placeholder="Tickets" value={form.ticketCount} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <button type="submit" className="btn btn-success">{isEditing ? "Update" : "Create"} Event</button>
    </form>
  );
};

export default EventForm;
