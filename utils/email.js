// Import the nodemailer library to send emails
const nodemailer = require('nodemailer');

// Create a transporter object to handle email sending
const transporter = nodemailer.createTransport({
  // Specify the email service to use (e.g., Gmail)
  service: process.env.EMAIL_SERVICE || 'gmail', // Allow override via env

  // Provide authentication details for the email account
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // TLS options for secure connection
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

// Define an asynchronous function to send an email
const sendEmail = async ({ email, subject, message }) => {
  // Validate input parameters
  if (!email || !subject || !message) {
    throw new Error('Email, subject, and message are required');
  }

  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(`[${new Date().toISOString()}] Missing EMAIL_USER or EMAIL_PASS in environment variables`);
    throw new Error('Email configuration is missing. Check environment variables.');
  }

  try {
    console.log(`[${new Date().toISOString()}] Attempting to send email to ${email} with subject: ${subject}`);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message,
    });
    console.log(`[${new Date().toISOString()}] Email sent: ${info.response}`);
    return info;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Email sending error: ${err.message}`, err.stack);
    if (err.code === 'EAUTH') {
      throw new Error('Invalid email credentials. Check EMAIL_USER and EMAIL_PASS.');
    } else if (err.code === 'ESOCKET' || err.code === 'ECONNREFUSED') {
      throw new Error('Failed to connect to email server. Check network or SMTP settings.');
    } else if (err.code === 'EENVELOPE') {
      throw new Error('Invalid recipient email address.');
    } else {
      throw new Error('Email could not be sent due to an unknown error.');
    }
  }
};

// Export the sendEmail function so it can be used in other files
module.exports = sendEmail;