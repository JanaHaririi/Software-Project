// Import the express library to create routes
const express = require('express');

// Create a new router object using express
const router = express.Router();

// Import authentication and role-based authorization middleware
const { authenticate, authorizeRoles } = require('../middleware/authorization');

// Import all controller functions related to user operations
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');

// ========================
// Public Routes (No authentication required)
// ========================

// Route to register a new user
router.post('/register', registerUser);

// Route to log in an existing user
router.post('/login', loginUser);

// Route to request a password reset link
router.post('/forgot-password', forgotPassword);

// Route to reset password using a token
router.put('/reset-password/:token', resetPassword);

// ========================
// Admin Routes (Only accessible by admin users)
// ========================

// Route to get all users in the system
router.get('/', authenticate, authorizeRoles('admin'), getAllUsers);

// Route to get a single user by their ID
router.get('/users/:id', authenticate, authorizeRoles('admin'), getUserById);

// Route to update a user's data by their ID
router.put('/:id', authenticate, authorizeRoles('admin'), updateUserById);

// Route to delete a user by their ID
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteUserById);

// ========================
// Authenticated User Routes
// ========================

// Route to get the profile of the currently logged-in user
router.get('/profile', authenticate, getUserProfile);

// Route to update the profile of the currently logged-in user
router.put('/profile', authenticate, updateUserProfile);

// Export the router to be used in the main application
module.exports = router;
