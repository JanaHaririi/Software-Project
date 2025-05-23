// src/components/admin/UserRow.jsx
import React from "react";
import axios from "axios";

const UserRow = ({ user, refreshUsers }) => {
  const handleDelete = async () => {
    if (window.confirm(`Delete ${user.name}?`)) {
      try {
        await axios.delete(`/api/users/${user._id}`);
        refreshUsers();
      } catch {
        alert("Failed to delete user.");
      }
    }
  };

  const handleRoleUpdate = async () => {
    const newRole = prompt("Enter new role: user, organizer, admin", user.role);
    if (newRole && newRole !== user.role) {
      try {
        await axios.put(`/api/users/${user._id}`, { role: newRole });
        refreshUsers();
      } catch {
        alert("Failed to update role.");
      }
    }
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button onClick={handleRoleUpdate} className="btn btn-sm btn-warning mr-2">Update Role</button>
        <button onClick={handleDelete} className="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
