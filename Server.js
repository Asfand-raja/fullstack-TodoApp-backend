require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/TodoRout');
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const passport = require('./passportConfig');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting:', err));

app.use('/auth', authRoutes);
app.use('/tasks', routes);

app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
