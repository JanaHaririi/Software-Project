
const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketCount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Booking', bookingSchema);