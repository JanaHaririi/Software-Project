// Import the express framework
const express = require('express');

// Import mongoose to connect to MongoDB
const mongoose = require('mongoose');

// Import dotenv to load environment variables from a .env file
const dotenv = require('dotenv');

// Import route files for authentication, users, events, and bookings
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables into process.env
dotenv.config();

// Initialize an Express application
const app = express();

// ========================
// Middleware
// ========================

// Middleware to parse incoming JSON requests
app.use(express.json());

// ========================
// Base Route
// ========================

// Define a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Event Ticketing System!');
});

// ========================
// Database Connection
// ========================

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URI)
  // Log success message if connected
  .then(() => console.log('MongoDB connected'))
  // Catch and log any errors if the connection fails
  .catch(err => console.log(err));

// ========================
// API Routes
// ========================

// Routes for authentication-related endpoints (e.g. register, login)
app.use('/api/v1/auth', authRoutes);

// Routes for user-related endpoints (e.g. profile, admin users)
app.use('/api/v1', userRoutes);

// Routes for event-related endpoints (e.g. create, list, update events)
app.use('/api/v1', eventRoutes);

// Routes for booking-related endpoints (e.g. book, cancel tickets)
app.use('/api/v1', bookingRoutes);

// ========================
// Error Handling Middleware
// ========================

// Centralized error handler to catch all errors and respond with status 500
app.use((err, req, res, next) => { // Added missing curly brace
  res.status(500).json({ message: err.message });
});

// ========================
// Start the Server
// ========================

// Define the port to listen on (use environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));