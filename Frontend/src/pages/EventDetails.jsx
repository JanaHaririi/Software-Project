import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

export default function EventDetails() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/v1/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError("Failed to fetch event details.");
      }
    };
    fetchEvent();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/v1/bookings", { eventId: id, quantity });
      setSuccess("Tickets booked successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book tickets.");
    }
  };

  if (!event) return <div>Loading...</div>;

  const totalPrice = event.ticketPrice * quantity;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2>{event.title}</h2>
        <p>Description: {event.description}</p>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>Location: {event.location}</p>
        <p>Category: {event.category}</p>
        <p>Ticket Price: ${event.ticketPrice}</p>
        <p>Available Tickets: {event.remainingTickets}</p>
        {currentUser && (
          <form onSubmit={handleBook}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={event.remainingTickets}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
              />
            </div>
            <p>Total Price: ${totalPrice}</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button
              type="submit"
              disabled={event.remainingTickets === 0}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#0077ff", color: "white", border: "none" }}
            >
              {event.remainingTickets === 0 ? "Sold Out" : event.remainingTickets < 5 ? `Only ${event.remainingTickets} left!` : "Book Tickets"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}