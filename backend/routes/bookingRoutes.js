import express from "express";

import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
} from "../controllers/bookingController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// User
router.post("/", protect, authorizeRoles("user"), createBooking);

router.get("/my-bookings", protect, authorizeRoles("user"), getMyBookings);

router.put("/:id/cancel", protect, authorizeRoles("user"), cancelBooking);

// Owner
router.get(
  "/owner/bookings",
  protect,
  authorizeRoles("owner"),
  getOwnerBookings,
);

router.put("/:id/approve", protect, authorizeRoles("owner"), approveBooking);

router.put("/:id/reject", protect, authorizeRoles("owner"), rejectBooking);

export default router;
