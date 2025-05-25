import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/api/v1/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        setError("Failed to fetch booking details.");
      }
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Booking Details</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>Event: {booking.event.title}</p>
        <p>Quantity: {booking.quantity}</p>
        <p>Total Price: ${booking.totalPrice}</p>
        <p>Status: {booking.status}</p>
        <p>Booked On: {new Date(booking.createdAt).toLocaleDateString()}</p>
      </div>
      <Footer />
    </div>
  );
}