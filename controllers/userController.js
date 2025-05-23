const User = require('../models/User'); // Import the User model for database interactions
const jwt = require('jsonwebtoken'); // Import jwt for generating JSON Web Tokens
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const crypto = require('crypto'); // Import crypto for generating random bytes
const sendEmail = require('../utils/email'); // Import the email utility for sending emails

// Function to generate a reset token
const getResetToken = () => crypto.randomBytes(20).toString('hex'); // Generates a random hex string

// Function to register a new user
const registerUser = async (req, res) => {
  console.log("🧾 Received body:", req.body);
  const { name, email, password } = req.body; // Destructure the request body for user details


  try {
    // Check if user exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' }); // Return error if user exists
    }

    // Create user in the database
    const user = await User.create({
      name,
      email,
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
    res.status(500).json({ message: 'Registration failed', error: err.message }); // Handle errors during registration
  }
};

// Function to authenticate user
const loginUser = async (req, res) => {
  console.log("Login requested:", req.body);
  const { email, password } = req.body; // Destructure the request body for login credentials

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
    res.status(500).json({ message: 'Login failed', error: err.message }); // Handle errors during login
  }
};

// Function to handle forgot password request
const forgotPassword = async (req, res) => {
  const { email } = req.body; // Destructure the request body for email

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
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`; // Create reset URL

    // Send email
    const message = `You requested a password reset. Click this link: \n\n ${resetUrl}`; // Prepare email message
    
    try {
      await sendEmail({ // Send email using the utility
        email: user.email,
        subject: 'Password Reset Token',
        message
      });

      res.status(200).json({ 
        success: true, 
        message: 'Password reset link sent to email' 
      });
    } catch (err) {
      // Reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({ 
        message: 'Email could not be sent',
        error: err.message 
      });
    }
  } catch (err) {
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
    res.status(500).json({ 
      message: 'Error resetting password', 
      error: err.message 
    });
  }
};

// Function to get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Fetch user details excluding password
    res.json(user); // Send user details in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message }); // Handle errors during fetching user profile
  }
};

// Function to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password'); // Update user profile
    res.json(user); // Send updated user profile in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user profile', error: err.message }); // Handle errors during profile update
  }
};

// Function to get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send list of users in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message }); // Handle errors during fetching users
  }
};

// Function to get user by ID (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Fetch user details excluding password
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }
    res.json(user); // Send user details in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message }); // Handle errors during fetching user by ID
  }
};

// Function to update user by ID (Admin)
const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password'); // Update user details
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }
    res.json(user); // Send updated user details in the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message }); // Handle errors during user update
  }
};

// Function to delete user by ID (Admin)
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }
    res.json({ message: 'User removed' }); // Send success message in the response
  } catch (err) {
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