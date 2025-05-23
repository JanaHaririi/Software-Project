import React, { useEffect, useState } from 'react';
import axios from '../../api';
import UserRow from './UserRow';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
