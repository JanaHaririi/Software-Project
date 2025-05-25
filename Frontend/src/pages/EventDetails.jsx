import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/v1/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Event not found.");
          setTimeout(() => navigate("/"), 2000); // Redirect to homepage after 2 seconds
        } else {
          setError(err.response?.data?.message || "Failed to fetch event details.");
        }
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError("");
    setSuccess("");

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (event.remainingTickets < quantity) {
      setBookingError("Not enough tickets available.");
      return;
    }

    try {
      await api.post("/api/v1/bookings", { eventId: id, quantity });
      setSuccess("Tickets booked successfully!");
      setEvent(prev => ({ ...prev, remainingTickets: prev.remainingTickets - quantity }));
    } catch (err) {
      setBookingError(err.response?.data?.message || "Failed to book tickets.");
    }
  };

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ flex: 1, padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "red" }}>{error}</p>
          <p>Redirecting to homepage...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;

  const totalPrice = event.ticketPrice * quantity;
  const isSoldOut = event.remainingTickets === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div className="event-details" style={{ flex: 1, padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h2>{event.title}</h2>
        <div className="event-info">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Ticket Price:</strong> ${event.ticketPrice}</p>
          <p><strong>Available Tickets:</strong> {event.remainingTickets}</p>
        </div>
        {currentUser && (
          <form onSubmit={handleBook} className="booking-form">
            <div style={{ marginBottom: "1rem" }}>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={event.remainingTickets}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                disabled={isSoldOut}
                style={{ padding: "0.5rem", marginLeft: "0.5rem", width: "100px" }}
              />
            </div>
            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
            {bookingError && <p style={{ color: "red" }}>{bookingError}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button
              type="submit"
              disabled={isSoldOut}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: isSoldOut ? "#ccc" : "#0077ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSoldOut ? "not-allowed" : "pointer",
              }}
            >
              {isSoldOut ? "Sold Out" : event.remainingTickets < 5 ? `Only ${event.remainingTickets} left!` : "Book Tickets"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}