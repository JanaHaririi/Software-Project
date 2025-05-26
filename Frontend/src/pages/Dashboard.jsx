import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  console.log(`[${new Date().toISOString()}] Dashboard - Accessed by user:`, user);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, textAlign: "center", padding: "2rem" }}>
        <h2>Welcome to Your Dashboard, {user?.name || 'User'}!</h2>
        <p>Role: {user?.role || 'Unknown'}</p>
        <p>This is your dashboard. Use the navigation bar to explore your bookings or events.</p>
      </div>
      <Footer />
    </div>
  );
}