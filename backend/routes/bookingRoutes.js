import express from "express";

import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
} from "../controllers/bookingController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// All booking routes require authentication
router.use(protect);

/*
|--------------------------------------------------------------------------
| Availability
|--------------------------------------------------------------------------
*/

// Logged-in users can check availability
router.get("/availability", checkAvailability);

/*
|--------------------------------------------------------------------------
| User / Customer
|--------------------------------------------------------------------------
*/

// Create booking
router.post("/", authorizeRoles("user"), createBooking);

// Get logged-in user's bookings
router.get("/my-bookings", authorizeRoles("user"), getMyBookings);

/*
|--------------------------------------------------------------------------
| Owner
|--------------------------------------------------------------------------
*/

// Get bookings received for owner's spaces
router.get("/owner", authorizeRoles("owner"), getOwnerBookings);

// Update booking status
router.put("/:id/status", authorizeRoles("owner"), updateBookingStatus);

/*
|--------------------------------------------------------------------------
| Common
|--------------------------------------------------------------------------
*/

// Get single booking
router.get("/:id", getBookingById);

// Cancel booking
router.put("/:id/cancel", cancelBooking);

export default router;
