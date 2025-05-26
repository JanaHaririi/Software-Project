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
  getAllEventsAdmin,
  getOrganizerEvents,
  getAllEventsAnalytics,
  approveEvent,
  declineEvent,
} = require('../controllers/eventController');

// ========================
// Public Routes for Events
// ========================

// Route to get all approved events (used by homepage)
router.get('/', getAllEvents);

// Route to get a specific event by ID
router.get('/:id', getEventById);

// ========================
// Organizer Routes for Events
// ========================

// Route to create a new event (only for organizers)
router.post('/', authenticate, authorizeRoles('organizer'), createEvent);

// Route to update an event by ID (only for organizers or admins)
router.put('/:id', authenticate, authorizeRoles('organizer', 'admin'), updateEvent);

// Route to delete an event by ID (only for organizers or admins)
router.delete('/:id', authenticate, authorizeRoles('organizer', 'admin'), deleteEvent);

// Route to get organizer's events
router.get('/organizer/events', authenticate, authorizeRoles('organizer'), getOrganizerEvents);

// ========================
// Admin Routes (Restricted to admins only)
// ========================

// Route to get all events for admin (including all statuses)
router.get('/admin/all', authenticate, authorizeRoles('admin'), getAllEventsAdmin);

// Route to get analytics data for all events
router.get('/analytics', authenticate, authorizeRoles('admin'), getAllEventsAnalytics);

// ========================
// Admin Routes for Approving/Declining Events
// ========================

// Route to approve an event (only for admins)
router.put('/:id/approve', authenticate, authorizeRoles('admin'), approveEvent);

// Route to decline an event (only for admins)
router.put('/:id/decline', authenticate, authorizeRoles('admin'), declineEvent);

// Export the router to be used in the main application
module.exports = router;