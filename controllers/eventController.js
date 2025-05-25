// Import the Event model for database interactions
const Event = require('../models/Event');
// Import the Booking model for database interactions
const Booking = require('../models/Booking');

// @desc    Get all events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    // Filter by status if provided in query parameters
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const events = await Event.find(filter).populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// @desc    Get all events for admin
// @access  Private/Admin
const getAllEventsAdmin = async (req, res) => {
  try {
    // Admin can see all events, no additional filtering needed
    const events = await Event.find().populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// @desc    Get single event
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event', error: err.message });
  }
};

// @desc    Create new event
// @access  Private/Organizer
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, totalTickets } = req.body;
    if (!title || !description || !date || !location || !price || !totalTickets) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = await Event.create({
      name: title, // Map title to name as per model
      description,
      date,
      location,
      price: parseFloat(price),
      totalTickets: parseInt(totalTickets, 10),
      availableTickets: parseInt(totalTickets, 10),
      organizer: req.user.id,
      status: 'pending', // Events need admin approval
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// @desc    Update event
// @access  Private/Organizer or Admin
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Organizers can update certain fields
    if (req.user.role === 'organizer') {
      const { title, description, date, location, price, totalTickets } = req.body;
      if (title) event.name = title;
      if (description) event.description = description;
      if (date) event.date = date;
      if (location) event.location = location;
      if (price) event.price = parseFloat(price);
      if (totalTickets) {
        const ticketsDifference = parseInt(totalTickets, 10) - event.totalTickets;
        event.availableTickets += ticketsDifference;
        event.totalTickets = parseInt(totalTickets, 10);
      }
    }
    // Admins can update status
    else if (req.user.role === 'admin' && req.body.status) {
      event.status = req.body.status;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

// @desc    Delete event
// @access  Private/Organizer or Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

// @desc    Get organizer's events
// @access  Private/Organizer
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// @desc    Get all events analytics for admin
// @access  Private/Admin
const getAllEventsAnalytics = async (req, res) => {
  try {
    const events = await Event.find();
    
    const analytics = await Promise.all(events.map(async (event) => {
      const bookingsCount = await Booking.countDocuments({ event: event._id });
      const percentageBooked = event.totalTickets > 0 ? (bookingsCount / event.totalTickets) * 100 : 0;
      
      return {
        eventId: event._id,
        eventName: event.name,
        totalTickets: event.totalTickets,
        ticketsBooked: bookingsCount,
        percentageBooked: percentageBooked.toFixed(2),
        revenue: bookingsCount * (event.price || 0),
      };
    }));

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

// Export all controller functions
module.exports = {
  getAllEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getAllEventsAnalytics,
};