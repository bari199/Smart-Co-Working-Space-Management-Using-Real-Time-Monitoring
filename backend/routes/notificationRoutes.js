import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Get all notifications
router.get("/", getNotifications);

// Delete all notifications
router.delete("/all", deleteAllNotifications);

// Mark single notification as read
router.put("/:id/read", markNotificationAsRead);

// Delete single notification
router.delete("/:id", deleteNotification);

export default router;
