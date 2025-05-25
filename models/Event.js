const mongoose = require("mongoose"); // Import Mongoose library for MongoDB interactions

// Define the schema for the Event model
const eventSchema = new mongoose.Schema({
  title: { // Define the title field for event title
    type: String, // Use String type for title
    required: true, // Title is required
    trim: true, // Trim any excess whitespace
  },
  description: { // Define the description field for event description
    type: String, // Use String type for description
    required: true, // Description is required
  },
  date: { // Define the date field for event date
    type: Date, // Use Date type for date
    required: true, // Date is required
  },
  location: { // Define the location field for event location
    type: String, // Use String type for location
    required: true, // Location is required
  },
  category: { // Define the category field for event category
    type: String, // Use String type for category
    enum: ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"], // Restrict category to specified enum values
    required: true, // Category is required
  },
  image: { // Define the image field for event image URL
    type: String, // Use String type for image URL
    default: "", // Default to an empty string if not provided
  },
  ticketPrice: { // Define the ticketPrice field for event ticket price
    type: Number, // Use Number type for ticket price
    required: true, // Ticket price is required
    min: 0, // Ticket price must be greater than or equal to 0
  },
  totalTickets: { // Define the totalTickets field for total number of tickets
    type: Number, // Use Number type for total tickets
    required: true, // Total tickets is required
    min: 1, // At least 1 ticket must be available
  },
  remainingTickets: { // Define the remainingTickets field for remaining tickets
    type: Number, // Use Number type for remaining tickets
    required: true, // Remaining tickets is required
    min: 0, // Remaining tickets must be greater than or equal to 0
  },
  organizer: { // Define the organizer field for the event organizer
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing documents
    ref: "User", // Reference the User model
    required: true, // Organizer is required
  },
  createdAt: { // Define the createdAt field for event creation date
    type: Date, // Use Date type for creation date
    default: Date.now, // Default to the current date and time
 },
});

// Create a Mongoose model based on the eventSchema and export it
module.exports = mongoose.model("Event", eventSchema);