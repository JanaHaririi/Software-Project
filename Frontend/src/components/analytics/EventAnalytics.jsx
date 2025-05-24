// src/components/analytics/EventAnalytics.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const EventAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/api/events/user/events/analytics")
      .then(res => setData(res.data))
      .catch(() => alert("Failed to fetch analytics"));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ticket Booking Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentageBooked" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventAnalytics;
