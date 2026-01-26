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

// 🔐 Trust proxy for HTTPS on Railway
app.set("trust proxy", 1);

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://you-todo-things.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Important: allow preflight requests
app.options("*", cors());


// ✅ Session setup
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// 🔗 MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 🌐 Root route & health check
app.get("/", (req, res) => res.json({ message: "✅ Todo App Backend running!" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 🔗 API routes
app.use("/auth", authRoutes);
app.use("/tasks", todoRoutes);

// ⚠️ Catch-all 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// 🚀 Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
