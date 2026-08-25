import mongoose from "mongoose";
import Notification from "../models/Notification.js";

// ======================================================
// GET MY NOTIFICATIONS
// ======================================================
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      // Booking notification data
      .populate("booking", "date startTime endTime status totalPrice")

      // Inquiry notification data
      .populate({
        path: "inquiry",
        select: "status message reply space user createdAt",
        populate: [
          {
            path: "space",
            select: "name location image",
          },
          {
            path: "user",
            select: "name email profilePicture",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ======================================================
// MARK NOTIFICATION AS READ
// ======================================================
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate notification ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // Only find notification belonging to logged-in user
    const notification = await Notification.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Mark as read only if unread
    if (!notification.read) {
      notification.read = true;
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE ONE NOTIFICATION
// ======================================================
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate notification ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // Delete only if notification belongs to logged-in user
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      notification,
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE ALL MY NOTIFICATIONS
// ======================================================
const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete all notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete all notifications",
      error: error.message,
    });
  }
};

export {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
};
