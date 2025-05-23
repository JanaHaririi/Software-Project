// src/components/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserRow from "./UserRow";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch {
      alert("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user._id} user={user} refreshUsers={fetchUsers} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
