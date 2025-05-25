import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import api from "../utils/api";
import "./HomePage.css";
import React from 'react';


export default function HomePage() {
  const navigate = useNavigate(); // Kept and used below
  const { loading } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6); // Show 6 events per page

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/v1/events");
        setEvents(res.data.filter(event => event.status === "approved"));
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    const matchesDate = dateFilter ? new Date(event.date).toISOString().split("T")[0] === dateFilter : true;
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div className="homepage" style={{ flex: 1, padding: "2rem" }}>
        <h1 className="title">🎟️ Welcome to EventHub</h1>
        <div className="filters" style={{ margin: "1rem 0", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search events by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.5rem", flex: "1", minWidth: "200px" }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: "0.5rem", minWidth: "150px" }}
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ padding: "0.5rem", minWidth: "150px" }}
          />
        </div>
        <div className="events-grid" style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
          {currentEvents.length > 0 ? (
            currentEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/events/${event.id}`)} // Use navigate here
                showStatus={false}
              />
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: currentPage === page ? "#0077ff" : "#f1f1f1",
                  color: currentPage === page ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}