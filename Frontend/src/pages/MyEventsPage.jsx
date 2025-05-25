import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/v1/users/events");
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events.");
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/api/v1/events/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError("Failed to delete event.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>My Events</h2>
        <button
          onClick={() => navigate("/my-events/new")}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#0077ff", color: "white", border: "none", marginBottom: "1rem" }}
        >
          Create New Event
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {events.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {events.map(event => (
              <div key={event.id} style={{ border: "1px solid #ddd", padding: "1rem" }}>
                <h3>{event.title}</h3>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Status: {event.status}</p>
                <button
                  onClick={() => navigate(`/my-events/${event.id}/edit`)}
                  style={{ padding: "0.5rem", marginRight: "0.5rem", backgroundColor: "#0077ff", color: "white", border: "none" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  style={{ padding: "0.5rem", backgroundColor: "#ff4444", color: "white", border: "none" }}
                >
                  Delete
                </button>
              </div>
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