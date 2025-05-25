import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

export default function UserBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/v1/users/bookings");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/api/v1/bookings/${bookingId}`);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      setError("Failed to cancel booking.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>My Bookings</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {bookings.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {bookings.map(booking => (
              <div key={booking.id} style={{ border: "1px solid #ddd", padding: "1rem" }}>
                <h3>{booking.event.title}</h3>
                <p>Quantity: {booking.quantity}</p>
                <p>Total Price: ${booking.totalPrice}</p>
                <p>Status: {booking.status}</p>
                <button
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  style={{ padding: "0.5rem", marginRight: "0.5rem", backgroundColor: "#0077ff", color: "white", border: "none" }}
                >
                  View Details
                </button>
                {booking.status === "Confirmed" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    style={{ padding: "0.5rem", backgroundColor: "#ff4444", color: "white", border: "none" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}