import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from 'react';


export default function UnauthorizedPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, textAlign: "center", padding: "2rem" }}>
        <h2>Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
      </div>
      <Footer />
    </div>
  );
}