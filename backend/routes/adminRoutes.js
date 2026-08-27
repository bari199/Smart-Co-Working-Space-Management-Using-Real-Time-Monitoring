import express from "express";

import {
  getAdminDashboard,
  getAllUsers,
  getAdminUserById,
  updateUserRole,
  deleteAdminUser,
  getAllOwners,
  getAdminSpaces,
  getAdminSpaceById,
  updateSpaceAvailability,
  deleteAdminSpace,
  getAdminBookings,
  getAdminBookingById,
  updateAdminBookingStatus,
  getAdminInquiries,
  getAdminInquiryById,
  getAdminPayments,
  getAdminPaymentById,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
=========================================================
ADMIN PROTECTION
=========================================================
*/

router.use(protect);
router.use(authorizeRoles("admin"));

/*
=========================================================
DASHBOARD
=========================================================
*/

// GET /api/admin/dashboard
router.get("/dashboard", getAdminDashboard);

/*
=========================================================
USERS
=========================================================
*/

// GET /api/admin/users
router.get("/users", getAllUsers);

// GET /api/admin/users/:id
router.get("/users/:id", getAdminUserById);

// PUT /api/admin/users/:id/role
router.put("/users/:id/role", updateUserRole);

// DELETE /api/admin/users/:id
router.delete("/users/:id", deleteAdminUser);

/*
=========================================================
OWNERS
=========================================================
*/

// GET /api/admin/owners
router.get("/owners", getAllOwners);

/*
=========================================================
WORKSPACES
=========================================================
*/

// GET /api/admin/spaces
router.get("/spaces", getAdminSpaces);

// GET /api/admin/spaces/:id
router.get("/spaces/:id", getAdminSpaceById);

// PUT /api/admin/spaces/:id/availability
router.put("/spaces/:id/availability", updateSpaceAvailability);

// DELETE /api/admin/spaces/:id
router.delete("/spaces/:id", deleteAdminSpace);

/*
=========================================================
BOOKINGS
=========================================================
*/

// GET /api/admin/bookings
router.get("/bookings", getAdminBookings);

// GET /api/admin/bookings/:id
router.get("/bookings/:id", getAdminBookingById);

// PUT /api/admin/bookings/:id/status
router.put("/bookings/:id/status", updateAdminBookingStatus);

/*
=========================================================
INQUIRIES
=========================================================
*/

// GET /api/admin/inquiries
router.get("/inquiries", getAdminInquiries);

// GET /api/admin/inquiries/:id
router.get("/inquiries/:id", getAdminInquiryById);

/*
=========================================================
PAYMENTS
=========================================================
*/

// GET /api/admin/payments
router.get("/payments", getAdminPayments);

// GET /api/admin/payments/:id
router.get("/payments/:id", getAdminPaymentById);

export default router;
