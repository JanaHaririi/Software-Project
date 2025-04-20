// Import the express library
const express = require('express');

// Create a new router object from express
const router = express.Router();

// Import authentication and role-based authorization middleware
const { authenticate, authorizeRoles } = require('../middleware/authorization');

// Import booking controller functions
const {
  createBooking,
  getBookingById,
  cancelBooking,
  getUserBookings
} = require('../controllers/bookingController');

// ========================
// User Routes for Bookings
// ========================

// Route to create a new booking (only accessible to authenticated users with 'user' role)
router.post('/', authenticate, authorizeRoles('user'), createBooking);

// Route to get all bookings for the logged-in user (only accessible to authenticated users with 'user' role)
router.get('/user', authenticate, authorizeRoles('user'), getUserBookings);

// Route to get a specific booking by ID (only accessible to authenticated users with 'user' role)
router.get('/:id', authenticate, authorizeRoles('user'), getBookingById);

// Route to cancel a specific booking by ID (only accessible to authenticated users with 'user' role)
router.delete('/:id', authenticate, authorizeRoles('user'), cancelBooking);

// Export the router to use it in the main application
module.exports = router;
