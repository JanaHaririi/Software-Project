const Booking = require('../models/Booking'); // Import the Booking model for database interactions
const Event = require('../models/Event'); // Import the Event model for database interactions

// Create new booking endpoint
// Access level: Private/User
const createBooking = async (req, res) => {
  try {
    const { eventId, tickets } = req.body; // Extract eventId and tickets from request body
    
    // Validate input data for existence and correctness
    if (!eventId || !tickets || tickets <= 0) {
      return res.status(400).json({ message: 'Invalid booking data' });
    }

    // Check if the event exists and if it's approved for booking
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    // Check if there are enough tickets available for the booking
    if (event.availableTickets < tickets) {
      return res.status(400).json({ 
        message: 'Not enough tickets available', 
        availableTickets: event.availableTickets 
      });
    }

    // Calculate the total price for the booking based on ticket price and quantity
    const totalPrice = event.price * tickets;

    // Create a new booking record in the database
    const booking = await Booking.create({
      user: req.user.id, // Assign the user ID from the request context
      event: eventId, // Assign the event ID
      tickets, // Assign the number of tickets
      totalPrice, // Assign the total price
      bookingDate: new Date() // Assign the current date to the booking date
    });

    // Update the event's available tickets by subtracting the booked tickets
    event.availableTickets -= tickets;
    await event.save();

    res.status(201).json(booking); // Send the created booking object in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

// Get booking by ID endpoint
// Access level: Private/User
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email') // Populate user information
      .populate('event', 'name date location price'); // Populate event information

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to view the booking (either owner or admin)
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking); // Send the booking details in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking', error: err.message });
  }
};

// Cancel booking endpoint
// Access level: Private/User
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to cancel the booking (either owner or admin)
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Get associated event to update ticket availability
    const event = await Event.findById(booking.event);
    if (!event) {
      return res.status(404).json({ message: 'Associated event not found' });
    }

    // Return tickets to the event by increasing available tickets
    event.availableTickets += booking.tickets;
    await event.save();

    // Delete the booking record
    await booking.deleteOne();

    res.json({ message: 'Booking cancelled successfully' }); // Send a success message in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
};

// Get user's bookings endpoint
// Access level: Private/User
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'name date location price'); // Populate event details for each booking
    res.json(bookings); // Send the list of bookings in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  cancelBooking,
  getUserBookings
};