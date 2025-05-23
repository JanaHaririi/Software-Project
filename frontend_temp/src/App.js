import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import ForgotPassword from './pages/ForgotPassword';
import AdminUsersPage from './components/Admin/AdminUsersPage';
import AdminEventsPage from './components/Admin/AdminEventsPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEventsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
