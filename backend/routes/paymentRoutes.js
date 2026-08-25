import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
  getPaymentByBooking,
} from "../controllers/paymentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createPaymentOrder);

router.post("/verify", protect, verifyPayment);

router.get("/booking/:bookingId", protect, getPaymentByBooking);

export default router;
