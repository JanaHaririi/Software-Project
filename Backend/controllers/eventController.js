const Event = require('../models/Event');
const Booking = require('../models/booking');

// Get all approved events (public)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// Create a new event (organizer only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, image, ticketPrice, totalTickets } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      image,
      ticketPrice,
      totalTickets,
      remainingTickets: totalTickets,
      organizer: req.user.id,
      status: "pending"
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// Update an event (organizer or admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only organizer or admin can update
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const { title, description, date, location, category, image, ticketPrice, totalTickets, status } = req.body;

    // Update fields if provided
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (category) event.category = category;
    if (image) event.image = image;
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
    if (totalTickets !== undefined) {
      // Adjust remainingTickets accordingly
      const diff = totalTickets - event.totalTickets;
      event.totalTickets = totalTickets;
      event.remainingTickets += diff;
      if (event.remainingTickets < 0) event.remainingTickets = 0;
    }
    if (status && req.user.role === 'admin') {
      event.status = status; // admin can approve or decline
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

// Delete an event (organizer or admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

// Get events of current organizer
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user events', error: err.message });
  }
};

// Get analytics for current organizer's events (percentage of tickets booked)
const getUserEventsAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const analytics = [];

    for (const event of events) {
      const totalTickets = event.totalTickets;
      const remainingTickets = event.remainingTickets;
      const bookedTickets = totalTickets - remainingTickets;
      const percentageBooked = totalTickets > 0 ? (bookedTickets / totalTickets) * 100 : 0;

      analytics.push({
        eventId: event._id,
        title: event.title,
        percentageBooked: Math.round(percentageBooked * 100) / 100,
      });
    }

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
  getUserEventsAnalytics,
};