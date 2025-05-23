import React from "react";

const EventCard = ({ event, isOrganizer, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3>{event.title}</h3>
      <p>{event.date} @ {event.location}</p>
      <p>Price: ${event.price}</p>
      <p>Tickets: {event.ticketCount}</p>
      <p>Status: {event.status}</p>

      {isOrganizer && (
        <div>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
