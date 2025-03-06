const express = require('express');
const nodemailer = require('nodemailer');
const Inquiry = require('../models/inquirySubmission'); // Path to your Inquiry model
const router = express.Router();
require('dotenv').config(); 

// Configure Nodemailer transporter using .env variables
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,
secure: false,

  auth: {
    user: 'sales@holidaylife.travel',
    pass: 'Sales@holi_997',
  },
});

// Helper function to send inquiry email to Admin
const sendInquiryEmail = async ({ name, email, phone_number, travel_date, traveller_count, message }) => {
  const mailOptions = {
    from: `${email}`, // "John Doe" <john@gmail.com>
    to: 'sales@holidaylife.travel',    // admin email from your .env or another email
    subject: `New Inquiry from ${name}`,
    html: `
      <h2>New Travel Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone_number}</p>
      <p><strong>Travel Date:</strong> ${travel_date}</p>
      <p><strong>Traveller Count:</strong> ${traveller_count}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// POST /api/inquiries
// Create a new inquiry + send email
router.post('/', async (req, res) => {
  const { name, email, phone_number, travel_date, traveller_count, message, tour_id } = req.body;

  if (!name || !email || !phone_number || !travel_date || !traveller_count) {
    return res.status(400).json({ message: 'Missing required fields. Please fill them all.' });
  }

  try {
    const newInquiry = new Inquiry({ name, email, phone_number, travel_date, traveller_count, message, tour_id: tour_id || null });
    await newInquiry.save();

    await sendInquiryEmail({ name, email, phone_number, travel_date, traveller_count, message });

    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error('Error processing inquiry submission:', error);
    res.status(500).json({ message: 'Error: Unable to submit your inquiry.', error: error.message });
  }
});

// GET /api/inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inquiries.', error: error.message });
  }
});

// DELETE /api/inquiries/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Inquiry.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting inquiry.' });
  }
});

// POST /api/inquiries/reply
router.post('/reply', async (req, res) => {
  const { inquiryId, email, subject, replyMessage } = req.body;

  if (!email || !subject || !replyMessage || !inquiryId) {
    return res.status(400).json({ message: 'Email, subject, reply message, and inquiry ID are required.' });
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text: replyMessage,
  };

  try {
    await transporter.sendMail(mailOptions);

    await Inquiry.findByIdAndUpdate(inquiryId, {
      reply: {
        subject,
        message: replyMessage,
        sentAt: new Date(),
      },
    });

    res.status(200).json({ message: 'Reply sent successfully.' });
  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({ message: 'Failed to send reply.', error: error.message });
  }
});

module.exports = router;
