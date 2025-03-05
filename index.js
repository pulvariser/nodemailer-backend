const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Test email configuration
transporter.verify((error) => {
  if (error) {
    console.error('Error verifying transporter:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// API endpoint to send email
app.post('/api/sendEmail', async (req, res) => {
  const { fullname, subject, email, mobile, message } = req.body;

  // Validate request body
  if (!fullname || !subject || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Email content
  const mailOptions = {
    from: email, // Sender's email
    to: process.env.EMAIL_USER, // Receiver's email (your email)
    subject: subject, // Email subject
    text: `
      Name: ${fullname}
      Email: ${email}
      Phone: ${mobile}
      Message: ${message}
    `, // Plain text body
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobile}</p>
      <p><strong>Message:</strong> ${message}</p>
    `, // HTML body
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});