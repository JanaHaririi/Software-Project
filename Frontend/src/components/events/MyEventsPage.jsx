// src/components/events/MyEventsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("/api/events/my-events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load your events.");
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/events/${eventId}`);
        fetchMyEvents();
      } catch (err) {
        alert("Failed to delete the event.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      <button onClick={() => navigate("/my-events/new")} className="btn btn-primary mb-4">+ Create New Event</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(event => (
          <EventCard
            key={event._id}
            event={event}
            isOrganizer
            onEdit={() => navigate(`/my-events/${event._id}/edit`)}
            onDelete={() => handleDelete(event._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyEventsPage;
