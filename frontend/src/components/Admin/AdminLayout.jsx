// src/components/Admin/AdminLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-64 p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/admin/users" className="hover:text-gray-300">Manage Users</Link>
          <Link to="/admin/events" className="hover:text-gray-300">Manage Events</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;