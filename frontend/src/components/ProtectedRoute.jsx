import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React from "react";

// allowedRoles is an array like ["User", "Organizer"]
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!currentUser) return <Navigate to="/login" />;

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
