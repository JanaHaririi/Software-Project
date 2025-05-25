import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

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
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "0.5rem" }}>
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {filteredEvents.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Title</th>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Date</th>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Status</th>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{event.title}</td>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{new Date(event.date).toLocaleDateString()}</td>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{event.status}</td>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                    {event.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(event.id)}
                          style={{ padding: "0.5rem", marginRight: "0.5rem", backgroundColor: "#28a745", color: "white", border: "none" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(event.id)}
                          style={{ padding: "0.5rem", backgroundColor: "#ff4444", color: "white", border: "none" }}
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No events found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}