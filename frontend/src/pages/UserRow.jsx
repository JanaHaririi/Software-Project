// src/components/UserRow.jsx
import { useState } from "react";
import api from "../utils/api";

export default function UserRow({ user, onUserUpdated, onUserDeleted }) {
  const [editing, setEditing] = useState(false);
  const [newRole, setNewRole] = useState(user.role);
  const [error, setError] = useState("");

  const handleRoleUpdate = async () => {
    try {
      await api.put(`/users/${user._id}`, { role: newRole });
      setEditing(false);
      onUserUpdated(); // re-fetch users from parent
    } catch (err) {
      console.error(err);
      setError("Update failed");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;
    try {
      await api.delete(`/users/${user._id}`);
      onUserDeleted(); // re-fetch users from parent
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        {editing ? (
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          user.role
        )}
      </td>
      <td>
        {editing ? (
          <>
            <button onClick={handleRoleUpdate}>Save</button>
            <button onClick={() => setEditing(false)} style={{ marginLeft: "6px" }}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}>Update Role</button>
            <button onClick={handleDelete} style={{ marginLeft: "6px" }}>Delete</button>
          </>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </td>
    </tr>
  );
}
