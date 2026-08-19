import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);

router.put("/:id/read", protect, markNotificationAsRead);

export default router;
