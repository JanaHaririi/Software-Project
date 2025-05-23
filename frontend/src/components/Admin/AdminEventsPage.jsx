import React, { useEffect, useState } from 'react';
import axios from '../../api';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/events/all');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  const handleApprove = async (id) => {
    // TODO: PUT /events/:id to update status
    alert(`Approve event ID: ${id}`);
  };

  const handleDecline = async (id) => {
    // TODO: PUT /events/:id to update status
    alert(`Decline event ID: ${id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id} className="border-t">
              <td className="p-2">{event.title}</td>
              <td className="p-2">{event.date}</td>
              <td className="p-2">{event.status}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleApprove(event._id)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                <button onClick={() => handleDecline(event._id)} className="bg-red-500 text-white px-2 py-1 rounded">Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEventsPage;
