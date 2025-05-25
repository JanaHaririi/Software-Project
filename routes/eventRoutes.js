// routes/eventRoutes.js
const express = require('express');
const router = express.Router();

// Import authentication and role-based authorization middleware
const { authenticate, authorizeRoles } = require('../middleware/authorization');

// Import event controller functions
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent,
  declineEvent,
} = require('../controllers/eventController');

// ========================
// Public Routes for Events
// ========================

// Route to get all events
router.get('/', getAllEvents);

// Route to get a specific event by ID
router.get('/:id', getEventById);

// ========================
// Organizer Routes for Events
// ========================

// Route to create a new event (only for organizers)
router.post('/', authenticate, authorizeRoles('organizer'), createEvent);

// Route to update an event by ID (only for organizers)
router.put('/:id', authenticate, authorizeRoles('organizer'), updateEvent);

// Route to delete an event by ID (only for organizers)
router.delete('/:id', authenticate, authorizeRoles('organizer'), deleteEvent);

// ========================
// Admin Routes for Approving/Declining Events
// ========================

// Route to approve an event (only for admins)
router.put('/:id/approve', authenticate, authorizeRoles('admin'), approveEvent);

// Route to decline an event (only for admins)
router.put('/:id/decline', authenticate, authorizeRoles('admin'), declineEvent);

module.exports = router;
