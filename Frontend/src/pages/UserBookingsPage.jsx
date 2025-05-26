import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import api from "../utils/api";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import "./UserBookingsPage.css";
import React from 'react';

export default function UserBookingsPage() {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        console.log(`[${new Date().toISOString()}] UserBookingsPage - Fetching bookings for user:`, currentUser);
        const res = await api.get('/bookings/user');
        console.log(`[${new Date().toISOString()}] UserBookingsPage - Fetched bookings:`, res.data);
        setBookings(res.data);
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to fetch bookings:`, err);
        setError(err.response?.data?.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser]);

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: "canceled" } : booking
      ));
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Failed to cancel booking:`, err);
      setError(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-bookings-page">
      <Navbar />
      <div className="content">
        <h2>My Bookings</h2>
        {bookings.length > 0 ? (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <EventCard event={booking.event} showStatus={false} />
                <p>Quantity: {booking.quantity}</p>
                <p>Total Price: ${(booking.quantity * (booking.event?.ticketPrice || 0)).toFixed(2)}</p>
                <p>Status: {booking.status}</p>
                {booking.status !== "canceled" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="cancel-button"
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