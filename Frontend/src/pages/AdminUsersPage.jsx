import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/api";
import React from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [roleModal, setRoleModal] = useState({ open: false, userId: null, newRole: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateRole = async () => {
    try {
      await api.put(`/users/${roleModal.userId}`, { role: roleModal.newRole });
      setUsers(users.map(user => (user._id === roleModal.userId ? { ...user, role: roleModal.newRole } : user)));
      setRoleModal({ open: false, userId: null, newRole: "" });
    } catch (err) {
      setError("Failed to update role.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>Manage Users</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {users.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Email</th>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Role</th>
                <th style={{ border: "1px solid #ddd", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{user.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{user.email}</td>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{user.role}</td>
                  <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>
                    <button
                      onClick={() => setRoleModal({ open: true, userId: user._id, newRole: user.role })}
                      style={{ padding: "0.5rem", marginRight: "0.5rem", backgroundColor: "#003166", color: "white", border: "none" }}
                    >
                      Update Role
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{ padding: "0.5rem", backgroundColor: "#ff4444", color: "white", border: "none" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
        {roleModal.open && (
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "2rem", border: "1px solid #ddd" }}>
            <h3>Update Role</h3>
            <select
              value={roleModal.newRole}
              onChange={(e) => setRoleModal({ ...roleModal, newRole: e.target.value })}
              style={{ padding: "0.5rem", marginBottom: "1rem" }}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
            <div>
              <button
                onClick={handleUpdateRole}
                style={{ padding: "0.5rem", marginRight: "0.5rem", backgroundColor: "#28a745", color: "white", border: "none" }}
              >
                Save
              </button>
              <button
                onClick={() => setRoleModal({ open: false, userId: null, newRole: "" })}
                style={{ padding: "0.5rem", backgroundColor: "#ff4444", color: "white", border: "none" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
