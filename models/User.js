// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Import bcryptjs for hashing passwords
const bcrypt = require('bcryptjs');

// Define a new Mongoose schema for the User model
const userSchema = new mongoose.Schema({
  
  // Define the 'name' field and make it required
  name: {
    type: String,
    required: true
  },

  // Define the 'email' field, make it required and unique
  email: {
    type: String,
    required: true,
    unique: true
  },

  // Define the 'password' field and make it required
  password: {
    type: String,
    required: true
  },

  // Define the 'role' field with allowed values and a default
  role: {
    type: String,
    enum: ['user', 'admin', 'organizer'],
    default: 'user'
  }
});

// Middleware that runs before saving a user document
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();

  // Hash the password with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);

  // Call the next middleware
  next();
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model so it can be used in other files
module.exports = User;
