const Event = require('../models/Event');
const Booking = require('../models/Booking');

const getAllEvents = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Fetching all events with query:`, req.query);
  try {
    // Build query for public homepage: default to approved events
    const filter = { status: 'approved' }; // Only show approved events unless overridden

    // Handle search functionality
    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search by title
        { description: { $regex: searchTerm, $options: 'i' } }, // Search by description
      ];
    }

    // Handle filtering by category
    if (req.query.category) {
      const validCategories = ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"];
      if (!validCategories.includes(req.query.category)) {
        console.log(`Invalid category filter: ${req.query.category}`);
        return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` });
      }
      filter.category = req.query.category;
    }

    // Handle filtering by date
    if (req.query.date) {
      const parsedDate = new Date(req.query.date);
      if (isNaN(parsedDate.getTime())) {
        console.log(`Invalid date filter: ${req.query.date}`);
        return res.status(400).json({ message: 'Invalid date format' });
      }
      filter.date = { $gte: parsedDate }; // Events on or after the specified date
    }

    const events = await Event.find(filter).populate('organizer', 'name email').lean();
    console.log(`Fetched ${events.length} events`);
    res.status(200).json(events);
  } catch (err) {
    console.error(`Error fetching events: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

const getAllEventsAdmin = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Fetching all events for admin`);
  try {
    const events = await Event.find().populate('organizer', 'name email').lean();
    console.log(`Fetched ${events.length} events for admin`);
    res.status(200).json(events);
  } catch (err) {
    console.error(`Error fetching admin events: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

const getEventById = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Fetching event by ID: ${req.params.id}`);
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid event ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id).populate('organizer', 'name email').lean();
    if (!event) {
      console.log(`Event not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log(`Fetched event: ${event.title}`);
    res.status(200).json(event);
  } catch (err) {
    console.error(`Error fetching event by ID: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch event', error: err.message });
  }
};

const createEvent = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Creating event with data:`, req.body);
  console.log(`[${new Date().toISOString()}] User:`, req.user);
  try {
    const { title, description, date, location, ticketPrice, totalTickets, category, image } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || ticketPrice == null || totalTickets == null || !category) {
      console.log('Missing required fields:', { title, description, date, location, ticketPrice, totalTickets, category });
      return res.status(400).json({ message: 'All fields are required: title, description, date, location, ticketPrice, totalTickets, category' });
    }

    // Validate data types and values
    if (typeof title !== 'string' || title.trim().length === 0) {
      console.log('Invalid title:', title);
      return res.status(400).json({ message: 'Title must be a non-empty string' });
    }
    if (typeof description !== 'string' || description.trim().length === 0) {
      console.log('Invalid description:', description);
      return res.status(400).json({ message: 'Description must be a non-empty string' });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.log('Invalid date:', date);
      return res.status(400).json({ message: 'Invalid date format' });
    }
    if (typeof location !== 'string' || location.trim().length === 0) {
      console.log('Invalid location:', location);
      return res.status(400).json({ message: 'Location must be a non-empty string' });
    }
    const parsedPrice = parseFloat(ticketPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      console.log('Invalid ticketPrice:', ticketPrice);
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    const parsedTotalTickets = parseInt(totalTickets, 10);
    if (isNaN(parsedTotalTickets) || parsedTotalTickets < 1) {
      console.log('Invalid totalTickets:', totalTickets);
      return res.status(400).json({ message: 'Total tickets must be a positive integer (minimum 1)' });
    }
    const validCategories = ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"];
    if (!validCategories.includes(category)) {
      console.log('Invalid category:', category);
      return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` });
    }
    if (image && (typeof image !== 'string' || !image.match(/^https?:\/\/.+/))) {
      console.log('Invalid image URL:', image);
      return res.status(400).json({ message: 'Image must be a valid URL (http or https)' });
    }

    // Create event
    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: parsedDate,
      location: location.trim(),
      ticketPrice: parsedPrice,
      totalTickets: parsedTotalTickets,
      remainingTickets: parsedTotalTickets,
      organizer: req.user.id,
      status: 'pending',
      category,
      image: image || "",
    });

    console.log(`Event created: ${event._id} - ${event.title}`);
    res.status(201).json(event);
  } catch (err) {
    console.error(`Error creating event: ${err.message}`);
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

const updateEvent = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Updating event ${req.params.id} with data:`, req.body);
  console.log(`[${new Date().toISOString()}] User:`, req.user);
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid event ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    let event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      console.log(`Unauthorized update attempt by user ${req.user.id} on event ${event._id}`);
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    if (req.user.role === 'organizer') {
      const { title, description, date, location, ticketPrice, totalTickets, category, image } = req.body;

      if (title && (typeof title !== 'string' || title.trim().length === 0)) {
        console.log('Invalid title:', title);
        return res.status(400).json({ message: 'Title must be a non-empty string' });
      }
      if (description && (typeof description !== 'string' || description.trim().length === 0)) {
        console.log('Invalid description:', description);
        return res.status(400).json({ message: 'Description must be a non-empty string' });
      }
      if (date && isNaN(new Date(date).getTime())) {
        console.log('Invalid date:', date);
        return res.status(400).json({ message: 'Invalid date format' });
      }
      if (location && (typeof location !== 'string' || location.trim().length === 0)) {
        console.log('Invalid location:', location);
        return res.status(400).json({ message: 'Location must be a non-empty string' });
      }
      if (ticketPrice != null) {
        const parsedPrice = parseFloat(ticketPrice);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          console.log('Invalid ticketPrice:', ticketPrice);
          return res.status(400).json({ message: 'Price must be a non-negative number' });
        }
        event.ticketPrice = parsedPrice;
      }
      if (totalTickets != null) {
        const parsedTotalTickets = parseInt(totalTickets, 10);
        if (isNaN(parsedTotalTickets) || parsedTotalTickets < 1) {
          console.log('Invalid totalTickets:', totalTickets);
          return res.status(400).json({ message: 'Total tickets must be a positive integer (minimum 1)' });
        }
        const ticketsDifference = parsedTotalTickets - event.totalTickets;
        event.remainingTickets += ticketsDifference;
        event.totalTickets = parsedTotalTickets;
      }
      if (category) {
        const validCategories = ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"];
        if (!validCategories.includes(category)) {
          console.log('Invalid category:', category);
          return res.status(400).json({ message: `Category must be one of: ${validCategories.join(', ')}` });
        }
        event.category = category;
      }
      if (image !== undefined) {
        if (image && (typeof image !== 'string' || !image.match(/^https?:\/\/.+/))) {
          console.log('Invalid image URL:', image);
          return res.status(400).json({ message: 'Image must be a valid URL (http or https) or empty' });
        }
        event.image = image;
      }

      if (title) event.title = title.trim();
      if (description) event.description = description.trim();
      if (date) event.date = new Date(date);
      if (location) event.location = location.trim();
    } else if (req.user.role === 'admin' && req.body.status) {
      if (!['pending', 'approved', 'declined'].includes(req.body.status)) {
        console.log(`Invalid status: ${req.body.status}`);
        return res.status(400).json({ message: 'Invalid status. Use pending, approved, or declined' });
      }
      event.status = req.body.status;
    }

    const updatedEvent = await event.save();
    console.log(`Event updated: ${updatedEvent._id} - ${updatedEvent.title}`);
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error(`Error updating event: ${err.message}`);
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Deleting event ${req.params.id}`);
  console.log(`[${new Date().toISOString()}] User:`, req.user);
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid event ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      console.log(`Unauthorized delete attempt by user ${req.user.id} on event ${event._id}`);
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    console.log(`Event deleted: ${event._id}`);
    res.status(200).json({ message: 'Event removed' });
  } catch (err) {
    console.error(`Error deleting event: ${err.message}`);
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

const getOrganizerEvents = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Fetching events for organizer ${req.user.id}`);
  try {
    if (!req.user.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid user ID format: ${req.user.id}`);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const events = await Event.find({ organizer: req.user.id }).lean();
    console.log(`Fetched ${events.length} events for organizer ${req.user.id}`);
    res.status(200).json(events);
  } catch (err) {
    console.error(`Error fetching organizer events: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

const getAllEventsAnalytics = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Fetching analytics for all events`);
  try {
    const events = await Event.find().lean();
    
    const analytics = await Promise.all(events.map(async (event) => {
      const bookings = await Booking.find({ event: event._id });
      const ticketsBooked = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
      const percentageBooked = event.totalTickets > 0 ? (ticketsBooked / event.totalTickets) * 100 : 0;
      
      return {
        eventId: event._id,
        eventName: event.title,
        totalTickets: event.totalTickets,
        ticketsBooked,
        percentageBooked: percentageBooked.toFixed(2),
        revenue: ticketsBooked * (event.ticketPrice || 0),
      };
    }));

    console.log(`Fetched analytics for ${analytics.length} events`);
    res.status(200).json(analytics);
  } catch (err) {
    console.error(`Error fetching analytics: ${err.message}`);
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

const approveEvent = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Approving event ${req.params.id}`);
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid event ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'approved';
    await event.save();
    console.log(`Event approved: ${event._id} - ${event.title}`);
    res.status(200).json({ message: 'Event approved', event });
  } catch (err) {
    console.error(`Error approving event: ${err.message}`);
    res.status(500).json({ message: 'Failed to approve event', error: err.message });
  }
};

const declineEvent = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Declining event ${req.params.id}`);
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid event ID format: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log(`Event not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'declined';
    await event.save();
    console.log(`Event declined: ${event._id} - ${event.title}`);
    res.status(200).json({ message: 'Event declined', event });
  } catch (err) {
    console.error(`Error declining event: ${err.message}`);
    res.status(500).json({ message: 'Failed to decline event', error: err.message });
  }
};

module.exports = {
  getAllEvents,
  getAllEventsAdmin,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getAllEventsAnalytics,
  approveEvent,
  declineEvent,
};