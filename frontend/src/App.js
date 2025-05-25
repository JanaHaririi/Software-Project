import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/events/:id" element={<EventDetails />} />
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
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;