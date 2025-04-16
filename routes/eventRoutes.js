const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
  getUserEventsAnalytics,
} = require('../controllers/eventController');
const authMiddleware = require('../middleware/authentication');
const authorizeRoles = require('../middleware/authorization');

// Public route to get all approved events
router.get('/', getAllEvents);

// Organizer routes
router.post('/', authMiddleware, authorizeRoles('organizer'), createEvent);
router.put('/:id', authMiddleware, authorizeRoles('organizer', 'admin'), updateEvent);
router.delete('/:id', authMiddleware, authorizeRoles('organizer', 'admin'), deleteEvent);
router.get('/user/events', authMiddleware, authorizeRoles('organizer'), getUserEvents);
router.get('/user/events/analytics', authMiddleware, authorizeRoles('organizer'), getUserEventsAnalytics);

module.exports = router;