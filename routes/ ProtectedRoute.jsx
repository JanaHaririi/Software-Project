import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  console.log(`[${new Date().toISOString()}] ProtectedRoute - User:`, user, 'Allowed Roles:', allowedRoles);

  // If user is not logged in, redirect to login
  if (!user) {
    console.log(`[${new Date().toISOString()}] ProtectedRoute - No user, redirecting to /login`);
    return <Navigate to="/login" />;
  }

  // If user role is not in allowed roles, redirect to unauthorized
  if (!user.role || !allowedRoles.includes(user.role)) {
    console.log(`[${new Date().toISOString()}] ProtectedRoute - Role ${user.role} not allowed, redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;