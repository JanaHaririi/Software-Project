import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import api from "../utils/api";
import Loader from "../components/Loader";
import React from 'react';


export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/users/bookings");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await api.put(`/api/v1/bookings/${bookingId}`, { status: "Canceled" });
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: "Canceled" } : booking
      ));
    } catch (err) {
      setError("Failed to cancel booking.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>My Bookings</h2>
        {bookings.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
            {bookings.map(booking => (
              <div key={booking.id}>
                <EventCard event={booking.event} showStatus={false} />
                <p>Quantity: {booking.quantity}</p>
                <p>Total Price: ${(booking.quantity * booking.event.ticketPrice).toFixed(2)}</p>
                <p>Status: {booking.status}</p>
                {booking.status !== "Canceled" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Booking
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