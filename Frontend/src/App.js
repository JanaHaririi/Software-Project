import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import MyEventsPage from "./components/events/MyEventsPage";
import EventForm from "./components/events/EventForm";
import AdminUsersPage from "./components/admin/AdminUsersPage";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/my-events" style={{ marginRight: "10px" }}>My Events</Link>
        <Link to="/my-events/new" style={{ marginRight: "10px" }}>Create Event</Link>
        <Link to="/admin/users">Admin Users</Link>
      </nav>

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<h1>Welcome to the Event Ticketing System</h1>} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/my-events/new" element={<EventForm />} />
          <Route path="/my-events/:id/edit" element={<EventForm />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
