// Import the express library to create routes
const express = require('express');

// Create a new router object using express
const router = express.Router();

// Import authentication and role-based authorization middleware
const { authenticate, authorizeRoles } = require('../middleware/authorization');

// Import all controller functions related to events
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getOrganizerEventsAnalytics
} = require('../controllers/eventController');

// ========================
// Public Routes (Accessible by anyone)
// ========================

// Route to get all events (public access)
router.get('/', getAllEvents);

// Route to get a specific event by ID (public access)
router.get('/:id', getEventById);

// ========================
// Organizer Routes (Restricted to organizers only)
// ========================

// Route to create a new event (accessible only by authenticated organizers)
router.post('/', authenticate, authorizeRoles('organizer'), createEvent);

// Route to get all events created by the logged-in organizer
router.get('/organizer/events', authenticate, authorizeRoles('organizer'), getOrganizerEvents);

// Route to get analytics data for the organizer's events
router.get('/organizer/analytics', authenticate, authorizeRoles('organizer'), getOrganizerEventsAnalytics);

// ========================
// Organizer or Admin Routes
// ========================

// Route to update an event by ID (accessible by organizers and admins)
router.put('/:id', authenticate, authorizeRoles('organizer', 'admin'), updateEvent);

// Route to delete an event by ID (accessible by organizers and admins)
router.delete('/:id', authenticate, authorizeRoles('organizer', 'admin'), deleteEvent);

// Export the router to be used in the main application
module.exports = router;
