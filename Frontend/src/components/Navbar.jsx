// src/components/Navbar.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import React from 'react';


export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <nav style={{ padding: "1rem", backgroundColor: "#003166", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>EventHub</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        {!currentUser ? (
          <>
            <button onClick={() => navigate("/login")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
              Login
            </button>
            <button onClick={() => navigate("/register")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
              Register
            </button>
          </>
        ) : (
          <>
            {currentUser.role === "organizer" && (
              <button onClick={() => navigate("/my-events")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
                My Events
              </button>
            )}
            {currentUser.role === "admin" && (
              <button onClick={() => navigate("/admin/events")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
                Manage Events
              </button>
            )}
            {currentUser.role === "admin" && (
              <button onClick={() => navigate("/admin/users")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
                Manage Users
              </button>
            )}
            {currentUser.role === "admin" && (
              <button onClick={() => navigate("/my-events/analytica")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
                Analytics
              </button>
            )}
            <button onClick={() => navigate("/profile")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
              Profile
            </button>
            {currentUser.role === "user" && (
              <button onClick={() => navigate("/bookings")} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
                My Bookings
              </button>
            )}
            <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", backgroundColor: "white", color: "#003166", border: "none", borderRadius: "4px" }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

