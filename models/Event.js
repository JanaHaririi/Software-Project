const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Concert", "Sports", "Theater", "Conference", "Festival", "Other"],
    required: true,
  },
  image: {
    type: String, // URL of the event image
    default: "",
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalTickets: {
    type: Number,
    required: true,
    min: 1,
  },
  remainingTickets: {
    type: Number,
    required: true,
    min: 0,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User who created the event
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "pending", "declined"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);