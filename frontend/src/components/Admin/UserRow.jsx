import React from 'react';

const UserRow = ({ user }) => {
  const handleDelete = () => {
    // TODO: Confirm and call DELETE /users/:id
    alert(`Delete user: ${user.email}`);
  };

  const handleRoleChange = () => {
    // TODO: Trigger modal or simple prompt
    const newRole = prompt('Enter new role (user, organizer, admin):', user.role);
    if (!newRole || newRole === user.role) return;
    // TODO: Call PUT /users/:id with new role
    alert(`Change role to ${newRole} for ${user.email}`);
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
