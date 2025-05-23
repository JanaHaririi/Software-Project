const mongoose = require('mongoose'); // Import the Mongoose library for MongoDB interactions

// Define a schema for the Booking model
const bookingSchema = new mongoose.Schema({
  user: { // Define the user field as a reference to the User model
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing documents
    ref: 'User', // Reference the User model
    required: true // Ensure the user field is required
  },
  event: { // Define the event field as a reference to the Event model
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing documents
    ref: 'Event', // Reference the Event model
    required: true // Ensure the event field is required
  },
  ticketCount: { // Define the ticketCount field to store the number of tickets
    type: Number, // Use the Number type
    required: true, // Ensure the ticketCount field is required
    min: 0 // Ensure ticketCount is not negative
  },
  totalPrice: { // Define the totalPrice field to store the total price of the booking
    type: Number, // Use the Number type
    required: true, // Ensure the totalPrice field is required
    min: 0 // Ensure totalPrice is not negative
  },
  status: { // Define the status field to store the booking status
    type: String, // Use the String type
    enum: ['pending', 'confirmed', 'canceled'], // Restrict the value to the specified enum
    default: 'pending' // Default the status to 'pending' if not provided
  },
  createdAt: { // Define the createdAt field to store the creation date of the booking
    type: Date, // Use the Date type
    default: Date.now // Set the default value to the current date and time
 }
});

// Create a Mongoose model based on the bookingSchema and export it
module.exports = mongoose.model('Booking', bookingSchema);