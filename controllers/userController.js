const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // 3. Generate token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      // 4. Respond
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  };
  const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // hide password
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      res.status(500).json({ message: 'Error getting profile', error: err.message });
    }
  };
  const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
  
      if (req.body.password) {
        const bcrypt = require('bcryptjs');
        user.password = await bcrypt.hash(req.body.password, 10);
      }
  
      const updatedUser = await user.save();
  
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } catch (err) {
      res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
  };
  const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // hide passwords
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
  };const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch user', error: err.message });
    }
  };
  
  const updateUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
  
      const updatedUser = await user.save();
  
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
  };
  const deleteUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.deleteOne();
  
      res.json({ message: `User ${user.name} deleted successfully` });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
  };
  
  module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById 
  };
  
  
  
  
  const crypto = require('crypto');
  const nodemailer = require('nodemailer');
  const User = require('../models/User');
  
  const otpStore = new Map();
  
  
  const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or any other email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  
  const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 minutes expiry
  
      await sendOtpEmail(email, otp);
      res.json({ message: 'OTP sent to email' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to send OTP', error: err.message });
    }
  };
  
  const resetPasswordWithOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
      const record = otpStore.get(email);
      if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
  
      if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  
      if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP expired' });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const bcrypt = require('bcryptjs');
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      otpStore.delete(email);
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to reset password', error: err.message });
    }
  };
  
  module.exports.requestPasswordReset = requestPasswordReset;
  module.exports.resetPasswordWithOtp = resetPasswordWithOtp;