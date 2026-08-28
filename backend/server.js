import "dotenv/config";

import express from "express";
import cors from "cors";

// ==============================
// Config
// ==============================

import connectDB from "./config/db.js";

// ==============================
// Routes
// ==============================

import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ==============================
// App
// ==============================

const app = express();

// ==============================
// Database
// ==============================

connectDB();

// ==============================
// CORS
// ==============================

const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Check allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS BLOCKED:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  }),
);

// ==============================
// Body Parsers
// ==============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==============================
// Root / Health
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Smart Co-Working Space API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Co-Working Space API is running",
  });
});

// ==============================
// API Routes
// ==============================

app.use("/api/auth", authRoutes);

app.use("/api/spaces", spaceRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/inquiries", inquiryRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/admin", adminRoutes);

// ==============================
// 404 Handler
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==============================
// Global Error Handler
// ==============================

app.use((error, req, res, next) => {
  console.error("=================================");
  console.error("GLOBAL ERROR");
  console.error("=================================");
  console.error(error);
  console.error("=================================");

  // ------------------------------
  // CORS Error
  // ------------------------------

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  // ------------------------------
  // Multer Error
  // ------------------------------

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // ------------------------------
  // File Validation Error
  // ------------------------------

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // ------------------------------
  // Generic Error
  // ------------------------------

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error?.message || "Internal Server Error",
  });
});

// ==============================
// Server
// ==============================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("Smart Co-Working Space API");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});
