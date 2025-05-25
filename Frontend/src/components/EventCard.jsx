import { useNavigate } from "react-router-dom";

const EventCard = ({ event, onEdit, onDelete, onApprove, onDecline, showStatus = true }) => {
  const navigate = useNavigate();

  return (
    <div
      className="event-card"
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div onClick={() => navigate(`/events/${event.id}`)}>
        <h3 style={{ margin: "0 0 0.5rem", color: "#333" }}>{event.title}</h3>
        <p style={{ margin: "0.3rem 0" }}>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p style={{ margin: "0.3rem 0" }}>Location: {event.location}</p>
        <p style={{ margin: "0.3rem 0" }}>Price: ${event.ticketPrice}</p>
        {showStatus && <p style={{ margin: "0.3rem 0" }}>Status: {event.status}</p>}
      </div>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0077ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        )}
        {onApprove && (
          <button
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Approve
          </button>
        )}
        {onDecline && (
          <button
            onClick={(e) => { e.stopPropagation(); onDecline(); }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;