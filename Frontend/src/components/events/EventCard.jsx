// src/components/events/EventCard.jsx
import React from "react";

const EventCard = ({ event, isOrganizer, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p>{event.date} @ {event.location}</p>
      <p>Price: ${event.price} | Tickets: {event.ticketCount}</p>
      <p>Status: {event.status}</p>
      {isOrganizer && (
        <div className="mt-2 flex gap-2">
          <button onClick={onEdit} className="btn btn-warning">Edit</button>
          <button onClick={onDelete} className="btn btn-danger">Delete</button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
