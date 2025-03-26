const express = require('express');
const nodemailer = require('nodemailer');
const Inquiry = require('../models/inquirySubmission'); // Path to your Inquiry model
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

// Function to send admin email
const sendAdminInquiryEmail = async ({
  name,
  email,
  phone_number,
  travel_date,
  traveller_count,
  message,
  tour,
  final_price,
  currency,
  selected_nights_key,
  selected_nights_option,
  selected_food_category
}) => {
  const htmlContent = `
      <h2>New Travel Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone_number}</p>
      <p><strong>Travel Date:</strong> ${travel_date}</p>
      <p><strong>Traveller Count:</strong> ${traveller_count}</p>
      ${tour ? `<p><strong>Tour ID:</strong> ${tour}</p>` : ''}
      ${final_price ? `<p><strong>Final Price:</strong> ${final_price}</p>` : ''}
      ${currency ? `<p><strong>Currency:</strong> ${currency}</p>` : ''}
      ${selected_nights_key ? `<p><strong>Selected Nights Key:</strong> ${selected_nights_key}</p>` : ''}
      ${selected_nights_option ? `<p><strong>Selected Nights Option:</strong> ${selected_nights_option}</p>` : ''}
      ${selected_food_category ? `<p><strong>Selected Food Category:</strong> ${selected_food_category}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

  const mailOptionsAdmin = {
    from: '"Holiday Life" <sales@holidaylife.travel>',
    to: 'sales@holidaylife.travel',
    subject: `New Inquiry from ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptionsAdmin);
};

// Function to send user email
const sendUserInquiryEmail = async ({
  name,
  email,
  phone_number,
  travel_date,
  traveller_count,
  message,
  tour,
  final_price,
  currency,
  selected_nights_key,
  selected_nights_option,
  selected_food_category
}) => {
  const htmlContent = `
      <h2>New Travel Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone_number}</p>
      <p><strong>Travel Date:</strong> ${travel_date}</p>
      <p><strong>Traveller Count:</strong> ${traveller_count}</p>
      ${tour ? `<p><strong>Tour ID:</strong> ${tour}</p>` : ''}
      ${final_price ? `<p><strong>Final Price:</strong> ${final_price}</p>` : ''}
      ${currency ? `<p><strong>Currency:</strong> ${currency}</p>` : ''}
      ${selected_nights_key ? `<p><strong>Selected Nights Key:</strong> ${selected_nights_key}</p>` : ''}
      ${selected_nights_option ? `<p><strong>Selected Nights Option:</strong> ${selected_nights_option}</p>` : ''}
      ${selected_food_category ? `<p><strong>Selected Food Category:</strong> ${selected_food_category}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

  const mailOptionsUser = {
    from: '"Holiday Life" <sales@holidaylife.travel>',
    to: email,
    subject: 'Thank you for your inquiry!',
    html: `
      <h2>Thank you for your inquiry, ${name}!</h2>
      <p>We have received your inquiry and will get back to you shortly.</p>
      <p>Here are the details you provided:</p>
      ${htmlContent}
    `,
  };

  return transporter.sendMail(mailOptionsUser);
};



// POST / - Save inquiry and send emails
router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone_number,
    travel_date,
    traveller_count,
    message,
    tour,
    final_price,
    currency,
    selected_nights_key,
    selected_nights_option,
    selected_food_category
  } = req.body;

  if (!name || !email || !phone_number || !travel_date || !traveller_count) {
    return res.status(400).json({ message: 'Missing required fields. Please fill them all.' });
  }

  try {
    const newInquiry = new Inquiry({
      name,
      email,
      phone_number,
      travel_date,
      traveller_count,
      message,
      tour,
      final_price,
      currency,
      selected_nights_key,
      selected_nights_option,
      selected_food_category,
    });
    await newInquiry.save();

    await Promise.all([
      sendAdminInquiryEmail({
        name,
        email,
        phone_number,
        travel_date,
        traveller_count,
        message,
        tour,
        final_price,
        currency,
        selected_nights_key,
        selected_nights_option,
        selected_food_category
      }),

      sendUserInquiryEmail({
        name,
        email,
        phone_number,
        travel_date,
        traveller_count,
        message,
        tour,
        final_price,
        currency,
        selected_nights_key,
        selected_nights_option,
        selected_food_category
      })
    ]);

    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error('Error processing inquiry submission:', error);
    res.status(500).json({ message: 'Error: Unable to submit your inquiry.', error: error.message });
  }
});

// GET / - Fetch all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inquiries.', error: error.message });
  }
});

// DELETE /:id - Delete a specific inquiry
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Inquiry.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting inquiry.' });
  }
});

// POST /reply - Reply to an inquiry
router.post('/reply', async (req, res) => {
  const { inquiryId, email, subject, replyMessage } = req.body;

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
