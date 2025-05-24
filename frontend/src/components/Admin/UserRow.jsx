import React from 'react';
import api from '../../api';


const UserRow = ({ user }) => {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${user.email}?`)) return;
  
    try {
      await api.delete(`/users/${user._id}`);
      alert('User deleted');
      // Optional: refresh user list after deletion
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };
  

const handleRoleChange = async () => {
  const newRole = prompt('Enter new role (user, organizer, admin):', user.role);
  if (!newRole || newRole === user.role) return;

  try {
    await api.put(`/users/${user._id}`, { role: newRole });
    alert(`Role updated to ${newRole}`);
    // Optional: refresh list after change
  } catch (err) {
    console.error(err);
    alert('Failed to update role');
  }
};




  return (
    <tr className="border-t">
      <td className="p-2">{user.name}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.role}</td>
      <td className="p-2 space-x-2">
        <button onClick={handleRoleChange} className="bg-blue-500 text-white px-2 py-1 rounded">Change Role</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
