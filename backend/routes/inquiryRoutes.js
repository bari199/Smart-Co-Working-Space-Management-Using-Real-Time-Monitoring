import express from "express";

import {
  createInquiry,
  getMyInquiries,
  getOwnerInquiries,
  replyToInquiry,
  closeInquiry,
} from "../controllers/inquiryController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// User
router.post("/", protect, authorizeRoles("user"), createInquiry);

router.get("/my-inquiries", protect, authorizeRoles("user"), getMyInquiries);

router.put("/:id/close", protect, closeInquiry);

// Owner
router.get(
  "/owner/inquiries",
  protect,
  authorizeRoles("owner"),
  getOwnerInquiries,
);

router.put("/:id/reply", protect, authorizeRoles("owner"), replyToInquiry);

export default router;
