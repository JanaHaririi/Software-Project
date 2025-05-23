const Event = require('../models/Event'); // Import the Event model for database interactions
const Booking = require('../models/Booking'); // Import the Booking model for database interactions

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
    const { name, description, date, location, price, totalTickets } = req.body;
    
    const event = await Event.create({
      name,
      description,
      date,
      location,
      price,
      totalTickets,
      availableTickets: totalTickets,
      organizer: req.user.id,
      status: 'pending' // Events need admin approval
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

    // Organizers can only update certain fields
    if (req.user.role === 'organizer') {
      const { totalTickets, date, location } = req.body;      
      // Calculate new available tickets if totalTickets is updated
      if (totalTickets) {
        const ticketsDifference = totalTickets - event.totalTickets;
        event.availableTickets += ticketsDifference;
        event.totalTickets = totalTickets;
      }
      
      if (date) event.date = date;
      if (location) event.location = location;
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

// @desc    Get organizer's events analytics
// @access  Private/Organizer
const getOrganizerEventsAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    
    const analytics = await Promise.all(events.map(async (event) => {
      const bookingsCount = await Booking.countDocuments({ event: event._id });
      const percentageBooked = (bookingsCount / event.totalTickets) * 100;
      
      return {
        eventId: event._id,
        eventName: event.name,
        totalTickets: event.totalTickets,
        ticketsBooked: bookingsCount,
        percentageBooked: percentageBooked.toFixed(2),
        revenue: bookingsCount * event.price
      };
    }));

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getOrganizerEventsAnalytics
};