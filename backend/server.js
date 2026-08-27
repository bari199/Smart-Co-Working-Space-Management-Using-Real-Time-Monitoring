import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

/*
========================================================
DATABASE
========================================================
*/

connectDB();

/*
========================================================
CORS
========================================================
*/

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

/*
========================================================
BODY PARSERS
========================================================
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
========================================================
HEALTH / ROOT
========================================================
*/

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

/*
========================================================
API ROUTES
========================================================
*/

app.use("/api/auth", authRoutes);

app.use("/api/spaces", spaceRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/inquiries", inquiryRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/payments", paymentRoutes);

/*
========================================================
MULTER / GLOBAL ERROR HANDLER
========================================================
*/

app.use((error, req, res, next) => {
  console.error("=================================");
  console.error("GLOBAL ERROR");
  console.error(error);
  console.error("=================================");

  /*
  Multer errors
  */

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  /*
  File validation errors
  */

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  /*
  Generic error
  */

  return res.status(500).json({
    success: false,
    message: error?.message || "Internal Server Error",
  });
});

/*
========================================================
SERVER
========================================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
