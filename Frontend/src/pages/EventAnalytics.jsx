// src/pages/EventAnalytics.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import api from "../utils/api";
import { Chart } from "chart.js";
import "./EventAnalytics.css";
import React from 'react';

export default function EventAnalytics() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/unauthorized");
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get("/events"); // Fetch all events (admin access)
        setEvents(res.data);
      } catch (err) {
        setError("Failed to fetch events for analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate, currentUser]);

  useEffect(() => {
    if (events.length > 0 && !chartInstance) {
      const ctx = document.getElementById("analyticsChart").getContext("2d");

      // Calculate booked percentage for each event
      const eventLabels = events.map(event => event.title);
      const bookedPercentages = events.map(event => {
        const totalTickets = event.totalTickets || event.ticketCount || 0;
        const remainingTickets = event.remainingTickets || 0;
        const bookedTickets = totalTickets - remainingTickets;
        return totalTickets > 0 ? ((bookedTickets / totalTickets) * 100).toFixed(2) : 0;
      });

      const newChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: eventLabels,
          datasets: [{
            label: "Tickets Booked (%)",
            data: bookedPercentages,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: "Percentage Booked (%)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Events",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Platform-Wide Event Ticket Booking Analytics",
            },
          },
          maintainAspectRatio: false,
        },
      });

      setChartInstance(newChartInstance);

      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [events, chartInstance]);

  if (loading) return <Loader />;
  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "2rem", textAlign: "center", color: "red" }}>{error}</div>
      <Footer />
    </div>
  );

  return (
    <div className="event-analytics-container">
      <Navbar />
      <div className="event-analytics">
        <h2>Event Analytics</h2>
        {error && <p className="error">{error}</p>}
        {events.length === 0 ? (
          <p>No events available for analytics.</p>
        ) : (
          <div className="chart-container">
            <canvas id="analyticsChart"></canvas>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}