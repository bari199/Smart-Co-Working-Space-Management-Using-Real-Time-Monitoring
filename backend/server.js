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

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Smart Co-Working Space API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Co-Working Space API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR:", error);
  console.error("MESSAGE:", error?.message);

  res.status(500).json({
    success: false,
    message: error?.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
