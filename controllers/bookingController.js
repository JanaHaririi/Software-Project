const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Create new booking endpoint
// Access level: Private/User
const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body; // Updated to quantity
    
    // Validate input data for existence and correctness
    if (!eventId || !quantity || quantity <= 0) {
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
    if (event.remainingTickets < quantity) {
      return res.status(400).json({ 
        message: 'Not enough tickets available', 
        remainingTickets: event.remainingTickets 
      });
    }

    // Calculate the total price for the booking based on ticket price and quantity
    const totalPrice = event.ticketPrice * quantity;

    // Create a new booking record in the database
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      quantity,
      totalPrice,
      bookingDate: new Date()
    });

    // Update the event's available tickets by subtracting the booked tickets
    event.remainingTickets -= quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

// Get booking by ID endpoint
// Access level: Private/User
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event', 'title date location ticketPrice');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to view the booking (either owner or admin)
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
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
    event.remainingTickets += booking.quantity;
    await event.save();

    // Update the booking status to canceled instead of deleting
    booking.status = 'canceled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
};

// Get user's bookings endpoint
// Access level: Private/User
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date location ticketPrice');
    res.json(bookings);
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