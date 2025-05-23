// File: routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/authentication');

// ========================
// Public Routes
// ========================
router.post('/register', register);
router.post('/login', login);

// ========================
// Protected Routes
// ========================
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;
