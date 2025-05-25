// Import required dependencies
const jwt = require('jsonwebtoken'); // Import jwt for generating JSON Web Tokens
const User = require('../models/User'); // Import the User model for database interactions
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords

// Helper function to generate a JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to set token in a cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict', // Prevent CSRF attacks
  });
};

// Function to register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure request body

  // Validate input
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  if (role && !['user', 'admin', 'organizer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be user, admin, or organizer' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // Password will be hashed by User schema pre-save middleware
      role: role || 'user', // Default to 'user' if no role provided
    });

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token); // Set token in cookie

    // Send success response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    // Handle specific MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({
      message: 'Registration failed',
      error: err.message,
    });
  }
};

// Function to log in an existing user
const login = async (req, res) => {
  const { email, password } = req.body; // Destructure request body

  // Validate input
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token); // Set token in cookie

    // Send success response
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Login failed',
      error: err.message,
    });
  }
};

// Function to log out a user
const logout = (req, res) => {
  // Clear the token cookie
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Expire immediately
    sameSite: 'strict',
  });

  // Send success response
  res.status(200).json({ message: 'Logged out successfully' });
};

// Function to get the authenticated user's details
const getMe = async (req, res) => {
  try {
    // Fetch user by ID, excluding sensitive fields
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user details
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch user',
      error: err.message,
    });
  }
};

// Export all controller functions
module.exports = {
  register,
  login,
  logout,
  getMe,
};