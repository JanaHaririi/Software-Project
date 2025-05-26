// src/pages/AdminManagePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AdminManagePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#191970", color: "white" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem", color: "white" }}>Admin Management</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/admin/events">
            <button
              style={{ padding: "0.75rem 1.5rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" }}
            >
              Manage Events
            </button>
          </Link>
          <Link to="/admin/users">
            <button
              style={{ padding: "0.75rem 1.5rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" }}
            >
              Manage Users
            </button>
          </Link>
        </div>
      </div>
      <Footer style={{ backgroundColor: "#191970", color: "white" }} />
    </div>
  );
}