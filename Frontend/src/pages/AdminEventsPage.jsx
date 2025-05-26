import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../utils/api";
import React from 'react';
import toast, { Toaster } from "react-hot-toast";

export default function AdminEventsPage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/events/admin/all");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events.");
        toast.error("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [currentUser, navigate]);

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/events/${eventId}/approve`);
      setEvents(events.map(event => (event._id === eventId ? { ...event, status: "approved" } : event)));
      toast.success("Event approved successfully!");
    } catch (err) {
      setError("Failed to approve event.");
      toast.error("Failed to approve event.");
    }
  };

  const handleDecline = async (eventId) => {
    try {
      await api.put(`/events/${eventId}/decline`);
      setEvents(events.map(event => (event._id === eventId ? { ...event, status: "declined" } : event)));
      toast.success("Event declined successfully!");
    } catch (err) {
      setError("Failed to decline event.");
      toast.error("Failed to decline event.");
    }
  };

  const filteredEvents = filter ? events.filter(event => event.status === filter) : events;

  if (loading) return <Loader />;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Toaster />
      <div style={{ flex: 1, padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>Manage Events</h2>
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <label>Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "4px" }}
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {filteredEvents.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Organizer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.organizer?.name || "N/A"}</td>
                  <td>{event.status}</td>
                  <td>
                    {event.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(event._id)} style={{ marginRight: "0.5rem" }}>Approve</button>
                        <button onClick={() => handleDecline(event._id)}>Decline</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No events found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
