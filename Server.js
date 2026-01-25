require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./passportConfig");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 REQUIRED for Railway (HTTPS proxy)
app.set("trust proxy", 1);

app.use(express.json());

// ✅ TEMP: allow all origins (safe for now)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(session({
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // Railway = HTTPS
    httpOnly: true,
    sameSite: "none"     // frontend-backend cookies
  }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

app.use("/auth", authRoutes);
app.use("/tasks", todoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
