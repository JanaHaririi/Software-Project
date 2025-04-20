// Import the express library
const express = require('express');

// Create a new router object from express
const router = express.Router();

// Import controller functions for authentication
const {
  register,
  login,
  logout,
  getMe
} = require('../controllers/authController');

// Import the authentication middleware to protect routes
const authenticate = require('../middleware/authentication'); // Fixed import

// ========================
// Public routes
// ========================

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

// ========================
// Protected routes
// ========================

// Route to get currently logged-in user's info (requires authentication)
router.get('/me', authenticate, getMe);

// Route to log out the current user (requires authentication)
router.post('/logout', authenticate, logout);

// Export the router to be used in the main app
module.exports = router;
