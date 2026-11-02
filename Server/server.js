const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport');
const tourRoutes = require('./routes/tourRoutes');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const inquireRoutes = require('./routes/inquiryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin: [
    'https://holidaylife.online',
    'https://www.holidaylife.online'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/tours', tourRoutes);
app.use('/inquiries', inquireRoutes);
app.use('/users', userRoutes);
app.use('/contact', contactRoutes);

// Put your MongoDB connection URL here, privately.
// Do not share the URL or password in chat.
mongoose.connect('mongodb+srv://shalini:Shalini%40LWD%40HL@cluster0.grvd0.mongodb.net/travel-website')
  .then(() => console.log('DB connect successful'))
  .catch((err) => console.error('DB connection error:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
