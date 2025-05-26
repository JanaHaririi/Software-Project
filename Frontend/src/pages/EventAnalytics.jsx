import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast, { Toaster } from "react-hot-toast";
import React from 'react';
import "./EventAnalytics.css";

export default function EventAnalytics() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get("/events/analytics");
        setAnalyticsData(res.data);
      } catch (err) {
        setError("Failed to fetch event analytics.");
        toast.error("Failed to fetch event analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [currentUser, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="event-analytics-container">
      <Navbar />
      <Toaster />
      <div className="event-analytics">
        <h2>Event Analytics</h2>
        {error && <p className="error">{error}</p>}
        {analyticsData.length === 0 ? (
          <p>No analytics data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="eventName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ticketsBooked" fill="#003166" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <Footer />
    </div>
  );
}
