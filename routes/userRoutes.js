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
  updateUserProfile,
} = require('../controllers/userController');

// ========================
// Public Routes (No authentication required)
// ========================
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// ========================
// Authenticated User Routes
// ========================
// ⚠️ Place /profile routes ABOVE dynamic /:id routes!
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

// ========================
// Admin Routes (Only accessible by admin users)
// ========================
router.get('/', authenticate, authorizeRoles('admin'), getAllUsers);
router.get('/:id', authenticate, authorizeRoles('admin'), getUserById);
router.put('/:id', authenticate, authorizeRoles('admin'), updateUserById);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteUserById);

// Export the router to be used in the main application
module.exports = router;