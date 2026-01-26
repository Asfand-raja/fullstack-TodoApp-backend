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

// 🔐 Trust proxy (REQUIRED for Railway + secure cookies)
app.set("trust proxy", 1);

// 📦 Body parser
app.use(express.json());

// 🌍 Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://you-todo-things.netlify.app",
];

// 🌐 CORS CONFIG — FIXED
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Incoming request origin:", origin);

      // Allow server-to-server, Postman, preflight, OAuth redirects
      if (!origin) return callback(null, true);

      // Allow known frontends
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 🚨 IMPORTANT:
      // Do NOT throw an error here — this causes "Network Error" in browsers
      return callback(null, true);
    },
    credentials: true, // 🔑 Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Allow preflight requests
app.options("*", cors());

// 🍪 Session configuration
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "dev-secret",
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

// 🛂 Passport
app.use(passport.initialize());
app.use(passport.session());

// 🗄️ MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 🩺 Health check
app.get("/", (req, res) =>
  res.json({ message: "✅ Todo App Backend running!" })
);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 🔗 Routes
app.use("/auth", authRoutes);
app.use("/tasks", todoRoutes);

// ❌ 404 handler
app.use((req, res) =>
  res.status(404).json({ message: "Route not found" })
);

// 🚀 Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
