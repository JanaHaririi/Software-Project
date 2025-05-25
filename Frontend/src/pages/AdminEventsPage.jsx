import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import api from "../utils/api";
import React from 'react';


export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/v1/events");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events.");
      }
    };
    fetchEvents();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/api/v1/events/${eventId}`, { status: "approved" });
      setEvents(events.map(event => (event.id === eventId ? { ...event, status: "approved" } : event)));
    } catch (err) {
      setError("Failed to approve event.");
    }
  };

  const handleDecline = async (eventId) => {
    try {
      await api.put(`/api/v1/events/${eventId}`, { status: "declined" });
      setEvents(events.map(event => (event.id === eventId ? { ...event, status: "declined" } : event)));
    } catch (err) {
      setError("Failed to decline event.");
    }
  };

  const filteredEvents = filter ? events.filter(event => event.status === filter) : events;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>Manage Events</h2>
        <div style={{ marginBottom: "1rem" }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "0.5rem", borderRadius: "4px" }}>
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {filteredEvents.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onApprove={event.status === "pending" ? () => handleApprove(event.id) : null}
                onDecline={event.status === "pending" ? () => handleDecline(event.id) : null}
              />
            ))}
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}