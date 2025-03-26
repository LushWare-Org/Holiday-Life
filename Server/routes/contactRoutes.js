const express = require('express');
const nodemailer = require('nodemailer');
const ContactSubmission = require('../models/ContactSubmission'); 
const router = express.Router();
require('dotenv').config();

// Configure transporter with TLS options
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sales@holidaylife.travel',
    pass: 'Sales@holi_997',
  }
});

// Verify the SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP verification error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Helper function to send inquiry emails (to user and admin)
const sendContactEmail = async ({ name, email, message }) => {
  const htmlContent = `
      <p>You have a new contact inquiry:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    
  const mailOptionsUser = {
    from: '"Holiday Life" <sales@holidaylife.travel>',
    to: email, 
    subject: `New Contact Inquiry from ${name}`,
    text: message,
    html: htmlContent,
  };

  const mailOptionsAdmin = {
    from: '"Holiday Life" <sales@holidaylife.travel>',
    to: 'sales@holidaylife.travel',
    subject: `New Contact Inquiry from ${name}`,
    text: message,
    html: htmlContent,
  };

  // Send both emails concurrently
  await Promise.all([
    transporter.sendMail(mailOptionsUser),
    transporter.sendMail(mailOptionsAdmin)
  ]);
};

// POST / - Save contact submission and send emails
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newSubmission = new ContactSubmission({ name, email, message });
    await newSubmission.save();

    // Send email notification
    await sendContactEmail({ name, email, message });

    res.status(200).json({ success: true, message: 'Thank you for contacting us! We have received your message.' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ success: false, message: 'Error: Unable to submit your message.', error: error.message });
  }
});

// GET /inquiries - Fetch all contact inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await ContactSubmission.find().sort({ submittedAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Unable to fetch inquiries.' });
  }
});

// DELETE /inquiries/:id - Delete a specific inquiry by ID
router.delete('/inquiries/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const inquiry = await ContactSubmission.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }
    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Error deleting inquiry.' });
  }
});

// POST /reply - Reply to an inquiry
router.post('/reply', async (req, res) => {
  const { email, subject, replyMessage, inquiryId } = req.body;

  if (!email || !subject || !replyMessage || !inquiryId) {
    return res.status(400).json({ message: 'Email, subject, reply message, and inquiry ID are required.' });
  }

  const mailOptions = {
    from: 'sales@holidaylife.travel',
    to: email,
    subject,
    text: replyMessage,
  };

  try {
    await transporter.sendMail(mailOptions);

    await ContactSubmission.findByIdAndUpdate(inquiryId, {
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
