import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";
import Events from "./pages/Events";
import ProtectedRoute from "./auth/ProtectedRoutes";


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes with Layout and Nested Children */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Index Route */}
          <Route index element={<Dashboard />} />

          {/* Users (admin only) */}
          <Route path="users">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <UserEdit />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Courses (admin only) */}
          <Route path="events">
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Events />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        {/* Wildcard Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;