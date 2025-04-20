// Import the nodemailer library to send emails
const nodemailer = require('nodemailer');

// Create a transporter object to handle email sending
const transporter = nodemailer.createTransport({
  // Specify the email service to use (e.g., Gmail)
  service: 'gmail', // Use your email service

  // Provide authentication details for the email account
  auth: {
    // Email username stored in environment variable
    user: process.env.EMAIL_USER,

    // Email password or app-specific password stored in environment variable
    pass: process.env.EMAIL_PASS
  }
});

// Define an asynchronous function to send an email
const sendEmail = async ({ email, subject, message }) => {
  try {
    // Use the transporter to send an email with the provided details
    await transporter.sendMail({
      // Sender email address
      from: process.env.EMAIL_USER,

      // Recipient email address
      to: email,

      // Subject of the email
      subject,

      // Plain text body of the email
      text: message
    });
  } catch (err) {
    // Log any errors that occur while sending the email
    console.error('Email sending error:', err);

    // Throw the error so it can be handled by the caller
    throw err;
  }
};

// Export the sendEmail function so it can be used in other files
module.exports = sendEmail;
