import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MyEventsPage from "./components/events/MyEventsPage";
import EventForm from "./components/events/EventForm";
import AdminUsersPage from "./components/admin/AdminUsersPage";
import EventAnalytics from "./components/analytics/EventAnalytics";

function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/my-events/new" element={<EventForm />} />
          <Route path="/my-events/:id/edit" element={<EventForm />} />
          <Route path="/my-events/analytics" element={<EventAnalytics />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
