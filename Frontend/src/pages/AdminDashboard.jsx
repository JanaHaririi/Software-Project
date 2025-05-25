// src/pages/AdminDashboard.jsx
import React from 'react';
import AdminLayout from '../components/Admin/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Welcome to the Admin Dashboard</h1>
      <p className="text-gray-600">Select a section from the sidebar to manage users or events.</p>
    </AdminLayout>
  );
};

export default AdminDashboard;
