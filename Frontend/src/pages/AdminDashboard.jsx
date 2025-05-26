// src/pages/AdminDashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleViewDashboard = () => {
    navigate('/admin/manage');
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#191970", color: "white" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", padding: "1rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", textAlign: "center", marginTop: "2rem", marginBottom: "2rem", color: "white" }}>Admin Dashboard</h1>
        <button
          onClick={handleViewDashboard}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#8028ef", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" }}
        >
          View Dashboard
        </button>
      </div>
      <Footer style={{ backgroundColor: "#191970", color: "white" }} />
    </div>
  );
}