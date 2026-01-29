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

// 🔐 Trust proxy (needed for secure cookies on Railway)
app.set("trust proxy", 1);

// 📦 Body parser
app.use(express.json());

// 🌍 Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://you-todo-things.netlify.app",
  "https://users-d.netlify.app", // ✅ your deployed frontend domain
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// 🌐 CORS CONFIG — secure and mobile-friendly
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // server requests or Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn("❌ Blocked CORS request from:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // 🔑 allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight requests
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
      httpOnly: true,                                // JS cannot access cookie
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-origin support
      maxAge: 1000 * 60 * 60 * 24,                  // 1 day
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
app.get("/", (req, res) => res.json({ message: "✅ Todo App Backend running!" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 🔗 Routes
app.use("/auth", authRoutes);
app.use("/tasks", todoRoutes);

// 📧 Optional: email verification placeholder
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ Email not configured. Verification emails will fail.");
}

// ❌ 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// 🚀 Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
