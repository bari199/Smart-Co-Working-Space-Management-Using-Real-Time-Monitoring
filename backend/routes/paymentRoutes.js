import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/create-order",
  protect,
  authorizeRoles("user"),
  createPaymentOrder,
);

router.post("/verify", protect, authorizeRoles("user"), verifyPayment);

export default router;
