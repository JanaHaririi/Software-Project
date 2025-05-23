// src/components/UpdateProfileForm.jsx
import React, { useState } from 'react';

const UpdateProfileForm = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ensure token is sent via cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully!');
        onUpdate(data); // update parent state
        onCancel(); // close form
      } else {
        setMessage(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      setMessage('Error updating profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>

      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UpdateProfileForm;
