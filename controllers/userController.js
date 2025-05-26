const User = require('../models/User'); // Import the User model for database interactions
const jwt = require('jsonwebtoken'); // Import jwt for generating JSON Web Tokens
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const crypto = require('crypto'); // Import crypto for generating random bytes
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails

// Function to generate a reset token
const getResetToken = () => crypto.randomBytes(20).toString('hex'); // Generates a random hex string

// Create a transporter object to handle email sending
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail', // Allow override via env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: false, // Use TLS on port 587
  tls: {
    rejectUnauthorized: false, // For testing; remove in production
  },
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error(`[${new Date().toISOString()}] Email transporter configuration error: ${error.message}`);
  } else {
    console.log(`[${new Date().toISOString()}] Email transporter is ready`);
  }
});

// Function to register a new user
const registerUser = async (req, res) => {
  console.log("🧾 Received body:", req.body);
  const { name, email, password } = req.body; // Destructure the request body for user details

  // Basic input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'Name must be a non-empty string' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if user exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' }); // Return error if user exists
    }

    // Create user in the database
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: await bcrypt.hash(password, 10), // Hash the password before saving
      role: 'user' // Default to 'user' if no role provided
    });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Sign token with user id and role

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token // Send token in the response
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Registration error:`, err.message);
    res.status(500).json({ message: 'Registration failed', error: err.message }); // Handle errors during registration
  }
};

// Function to authenticate user
const loginUser = async (req, res) => {
  console.log("Login requested:", req.body);
  const { email, password } = req.body; // Destructure the request body for login credentials

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check for user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Return error if user not found
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Return error if password does not match
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Sign token with user id and role

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token // Send token in the response
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Login error:`, err.message);
    res.status(500).json({ message: 'Login failed', error: err.message }); // Handle errors during login
  }
};

// Function to handle forgot password request
const forgotPassword = async (req, res) => {
  const { email } = req.body; // Destructure the request body for email

  // Basic input validation
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }

    // Generate reset token and expiry
    const resetToken = getResetToken(); // Generate reset token
    const resetTokenExpiry = Date.now() + 3600000; // Set expiry to 1 hour

    user.resetPasswordToken = resetToken; // Assign reset token to user document
    user.resetPasswordExpires = resetTokenExpiry; // Assign expiry time
    await user.save(); // Save the user document

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

    // Prepare email message
    const message = `You requested a password reset. Click this link: \n\n ${resetUrl}`;

    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(`[${new Date().toISOString()}] Missing EMAIL_USER or EMAIL_PASS in environment variables`);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email configuration is missing. Check environment variables.' });
    }

    // Debug email credentials
    console.log(`[${new Date().toISOString()}] Using EMAIL_USER: ${process.env.EMAIL_USER}, EMAIL_PASS: ${process.env.EMAIL_PASS ? 'set' : 'not set'}`);

    // Send email
    try {
      console.log(`[${new Date().toISOString()}] Attempting to send email to ${email} with reset URL: ${resetUrl}`);
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Token',
        text: message,
      });
      console.log(`[${new Date().toISOString()}] Email sent: ${info.response}`);
      res.status(200).json({ 
        success: true, 
        message: 'Password reset link sent to email' 
      });
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Email sending error: ${err.message}`, err.stack);
      // Reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      if (err.code === 'EAUTH') {
        return res.status(500).json({ message: 'Invalid email credentials. Check EMAIL_USER and EMAIL_PASS.' });
      } else if (err.code === 'ESOCKET' || err.code === 'ECONNREFUSED') {
        return res.status(500).json({ message: 'Failed to connect to email server. Check network or SMTP settings.' });
      } else if (err.code === 'EENVELOPE') {
        return res.status(400).json({ message: 'Invalid recipient email address.' });
      } else {
        return res.status(500).json({ message: 'Email could not be sent due to an unknown error.', error: err.message });
      }
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in forgotPassword: ${err.message}`, err.stack);
    res.status(500).json({ 
      message: 'Error processing request', 
      error: err.message 
    });
  }
};

// Function to reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Basic input validation
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired token' 
      });
    }

    // Set new password
    user.password = await bcrypt.hash(password, 10); // Hash the new password
    user.resetPasswordToken = undefined; // Clear reset token
    user.resetPasswordExpires = undefined; // Clear expiry time
    await user.save(); // Save the user document

    // Create new JWT
    const authToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token: authToken,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Reset password error:`, err.message);
    res.status(500).json({ 
      message: 'Error resetting password', 
      error: err.message 
    });
  }
};

// Function to get user profile
const getUserProfile = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Fetching profile for user:`, req.user);
    const user = await User.findById(req.user.id).select('-password'); // Fetch user details excluding password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send user details in the response
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Get profile error:`, err.message);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message }); // Handle errors during fetching user profile
  }
};

// Function to update user profile
const updateUserProfile = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Updating profile for user:`, req.user);
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password'); // Update user profile
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send updated user profile in the response
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Update profile error:`, err.message);
    res.status(500).json({ message: 'Failed to update user profile', error: err.message }); // Handle errors during profile update
  }
};

// Function to get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Fetching all users by:`, req.user);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const users = await User.find(); // Fetch all users
    res.json(users); // Send list of users in the response
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Get all users error:`, err.message);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message }); // Handle errors during fetching users
  }
};

// Function to get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Fetching user by ID by:`, req.user);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const user = await User.findById(req.params.id).select('-password'); // Fetch user details excluding password
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }
    res.json(user); // Send user details in the response
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Get user by ID error:`, err.message);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message }); // Handle errors during fetching user by ID
  }
};

// Function to update user by ID (Admin only)
const updateUserById = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Updating user by ID by:`, req.user);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password'); // Update user details
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }
    res.json(user); // Send updated user details in the response
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Update user by ID error:`, err.message);
    res.status(500).json({ message: 'Failed to update user', error: err.message }); // Handle errors during user update
  }
};

// Function to delete user by ID (Admin only)
const deleteUserById = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Deleting user by ID by:`, req.user);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }
    res.json({ message: 'User removed' }); // Send success message in the response
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Delete user by ID error:`, err.message);
    res.status(500).json({ message: 'Failed to delete user', error: err.message }); // Handle errors during user deletion
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};