import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Public pages
import HomePage from "./pages/HomePage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import ForgotPassword from "./pages/ForgotPassword";

// Protected pages
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";

// Utilities
import ProtectedRoute from "./components/ProtectedRoute"; // Must be implemented
import UnauthorizedPage from "./pages/UnauthorizedPage";   // Simple "Access Denied" page

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authenticated user route */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={["user", "organizer", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          } />

        
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          {/* Fallback for unauthorized users */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
