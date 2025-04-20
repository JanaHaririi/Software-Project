const jwt = require('jsonwebtoken'); // Import JSON Web Token library for authentication
const User = require('../models/User'); // Import the User model for database interactions
const bcrypt = require('bcryptjs'); // Import bcrypt library for hashing passwords

// Function to register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure the request body for user details

  try {
    // Check if user exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) { // If user already exists, return an error response
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password before saving
      role: role || 'user' // Default to 'user' if no role provided
    });

    // Generate a JWT token for authentication
    const token = generateToken(user._id, user.role);

    // Set HTTP-only cookie for the token
    setTokenCookie(res, token);

    // Send a success response with user details and token
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    // Handle any errors during the registration process
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Function to authenticate user
const login = async (req, res) => {
  const { email, password } = req.body; // Destructure the request body for login credentials

  try {
    // Check for user in the database
    const user = await User.findOne({ email });
    if (!user) { // If user does not exist, return an error response
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { // If password does not match, return an error response
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Send a success response with user details and token
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    // Handle any errors during the login process
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Function to logout user
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) // Set cookie to expire immediately
  });
  res.json({ message: 'Logged out successfully' });
};

// Function to get current user details
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Fetch user details excluding password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// Function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Sign token with user id and role
};

// Function to set token cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe
};