const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./passport'); 
const tourRoutes = require('./routes/tourRoutes');
const bodyParser = require("body-parser");
const contactRoutes = require('./routes/contactRoutes'); 
const inquireRoutes = require('./routes/inquiryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: ["https://holidaylife.travel", "https://www.holidaylife.travel"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Add "OPTIONS" here
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/tours', tourRoutes);
app.use('/inquiries', inquireRoutes);
app.use('/users', userRoutes);
app.use('/contact', contactRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://shalini:Shalini%40LWD%40HL@cluster0.grvd0.mongodb.net/travel-website', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connect successful'))
  .catch((err) => console.error('DB connection error:', err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
