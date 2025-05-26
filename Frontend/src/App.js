// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import EventDetails from "./pages/EventDetails";
import UserBookingsPage from "./pages/UserBookingsPage";
import BookingDetails from "./pages/BookingDetails";
import MyEventsPage from "./pages/MyEventsPage";
import EventForm from "./pages/EventForm";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminManagePage from "./pages/AdminManagePage"; // Import the new page
import UnauthorizedPage from "./pages/UnauthorizedPage";
import EventAnalytics from "./pages/EventAnalytics";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import React from 'react';

function ErrorBoundary({ children }) {
  const { setError } = useContext(AuthContext);

  useEffect(() => {
    const handleError = (error) => {
      setError("An unexpected error occurred. Please try again or contact support.");
      console.error("Error Boundary caught:", error);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [setError]);

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Authenticated Routes with Role-Based Access */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user", "organizer", "admin"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/:id"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute allowedRoles={["organizer"]}>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events/new"
              element={
                <ProtectedRoute allowedRoles={["organizer"]}>
                  <EventForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["organizer"]}>
                  <EventForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events/analytica"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EventAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminManagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "organizer", "user"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for 404 with consistent styling */}
            <Route
              path="*"
              element={
                <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#f9f9f9", minHeight: "80vh" }}>
                  <h2 style={{ color: "#333" }}>404 - Page Not Found</h2>
                  <p style={{ color: "#666" }}>
                    The page you are looking for does not exist.{" "}
                    <a href="/" style={{ color: "#003166" }}>
                      Go back to Home
                    </a>
                  </p>
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;