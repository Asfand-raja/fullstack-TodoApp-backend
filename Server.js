require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const passport = require('./passportConfig');

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

app.use(cors({
  origin: true,        // frontend domain, or '*' for testing
  credentials: true    // REQUIRED for sessions + cookies
}));

app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     // true ONLY if using HTTPS
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

/* -------------------- MONGODB CONNECTION -------------------- */
if (!process.env.MONGODB_URL) {
  console.error('❌ MONGODB_URL is missing! Set it in .env or Render ENV.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 10000 // waits max 10s for primary
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

/* -------------------- ROUTES -------------------- */
app.use('/auth', authRoutes);
app.use('/tasks', todoRoutes);

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
