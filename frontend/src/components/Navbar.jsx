import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React from 'react';


export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav style={{ backgroundColor: "#0077ff", padding: "1rem", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem" }}>
          EventHub
        </Link>
        <div>
          {!currentUser ? (
            <>
              <Link to="/login" style={{ color: "white", marginRight: "1rem" }}>
                Login
              </Link>
              <Link to="/register" style={{ color: "white" }}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={{ color: "white", marginRight: "1rem" }}>
                Profile
              </Link>
              {currentUser.role === "organizer" && (
                <>
                  <Link to="/my-events" style={{ color: "white", marginRight: "1rem" }}>
                    My Events
                  </Link>
                  <Link to="/my-events/analytica" style={{ color: "white", marginRight: "1rem" }}>
                    Analytics
                  </Link>
                </>
              )}
              {currentUser.role === "user" && (
                <Link to="/bookings" style={{ color: "white", marginRight: "1rem" }}>
                  My Bookings
                </Link>
              )}
              {currentUser.role === "admin" && (
                <>
                  <Link to="/admin/events" style={{ color: "white", marginRight: "1rem" }}>
                    Manage Events
                  </Link>
                  <Link to="/admin/users" style={{ color: "white", marginRight: "1rem" }}>
                    Manage Users
                  </Link>
                </>
              )}
              <button onClick={handleLogout} style={{ color: "white", background: "none", border: "none" }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}