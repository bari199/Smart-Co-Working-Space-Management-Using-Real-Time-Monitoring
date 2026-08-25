import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Space from "../models/Space.js";
import Notification from "../models/Notification.js";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Normalize YYYY-MM-DD as a local calendar date.
 * Avoids timezone issues caused by new Date("YYYY-MM-DD").
 */
const normalizeDate = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // Prevent invalid dates such as 2026-02-31
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

/**
 * Convert HH:mm into minutes.
 */
const timeToMinutes = (time) => {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

/**
 * Check whether two time ranges overlap.
 *
 * Example:
 * Existing: 09:00 - 12:00
 * Requested: 11:00 - 14:00
 * => true
 *
 * Existing: 09:00 - 12:00
 * Requested: 12:00 - 15:00
 * => false
 */
const isTimeOverlap = (
  existingStart,
  existingEnd,
  requestedStart,
  requestedEnd,
) => {
  return existingStart < requestedEnd && existingEnd > requestedStart;
};

/**
 * Check whether a booking list contains an overlapping booking.
 */
const findConflictBooking = (bookings, startMinutes, endMinutes) => {
  return bookings.find((booking) => {
    const existingStart = timeToMinutes(booking.startTime);
    const existingEnd = timeToMinutes(booking.endTime);

    if (existingStart === null || existingEnd === null) {
      return false;
    }

    return isTimeOverlap(existingStart, existingEnd, startMinutes, endMinutes);
  });
};

/**
 * Get user ID safely.
 */
const getUserId = (req) => {
  return req.user?._id?.toString();
};

/* =========================================================
   CREATE BOOKING
========================================================= */

const createBooking = async (req, res) => {
  try {
    const {
      space: spaceId,
      date,
      startTime,
      endTime,
      guests,
      notes,
    } = req.body;

    const userId = getUserId(req);

    /* ---------------------------------------------
       AUTH CHECK
    --------------------------------------------- */

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    /* ---------------------------------------------
       REQUIRED FIELDS
    --------------------------------------------- */

    if (!spaceId || !date || !startTime || !endTime || guests === undefined) {
      return res.status(400).json({
        success: false,
        message: "Space, date, time and guests are required",
      });
    }

    /* ---------------------------------------------
       SPACE ID VALIDATION
    --------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    /* ---------------------------------------------
       DATE VALIDATION
    --------------------------------------------- */

    const bookingDate = normalizeDate(date);

    if (!bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date. Use YYYY-MM-DD",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    /* ---------------------------------------------
       TIME VALIDATION
    --------------------------------------------- */

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes === null || endMinutes === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:mm",
      });
    }

    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    /* ---------------------------------------------
       GUEST VALIDATION
    --------------------------------------------- */

    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Guests must be at least 1",
      });
    }

    /* ---------------------------------------------
       FIND SPACE
    --------------------------------------------- */

    const space = await Space.findById(spaceId);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    /* ---------------------------------------------
       SPACE AVAILABILITY
    --------------------------------------------- */

    if (space.availability !== "available") {
      return res.status(400).json({
        success: false,
        message: "This workspace is currently unavailable",
      });
    }

    /* ---------------------------------------------
       CAPACITY
    --------------------------------------------- */

    if (guestCount > Number(space.capacity)) {
      return res.status(400).json({
        success: false,
        message: `Maximum capacity is ${space.capacity}`,
      });
    }

    /* ---------------------------------------------
       CHECK EXISTING USER BOOKING
       
       Prevent same user from creating the exact
       same booking repeatedly.
    --------------------------------------------- */

    const sameUserBookings = await Booking.find({
      user: userId,
      space: spaceId,
      date: bookingDate,
      status: {
        $in: ["pending", "confirmed"],
      },
    }).select("_id startTime endTime status");

    const sameUserConflict = findConflictBooking(
      sameUserBookings,
      startMinutes,
      endMinutes,
    );

    if (sameUserConflict) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a booking for this workspace and selected time",
        bookingId: sameUserConflict._id,
      });
    }

    /* ---------------------------------------------
       CHECK OTHER BOOKINGS

       Pending + confirmed bookings block the slot.
    --------------------------------------------- */

    const existingBookings = await Booking.find({
      space: spaceId,
      date: bookingDate,
      status: {
        $in: ["pending", "confirmed"],
      },
    }).select("_id user startTime endTime status");

    const conflictBooking = findConflictBooking(
      existingBookings,
      startMinutes,
      endMinutes,
    );

    if (conflictBooking) {
      return res.status(409).json({
        success: false,
        message: "This workspace is already booked for the selected time",
      });
    }

    /* ---------------------------------------------
       CALCULATE PRICE
    --------------------------------------------- */

    const durationHours = (endMinutes - startMinutes) / 60;

    const hourlyPrice = Number(space.price) || 0;

    const totalPrice = Math.ceil(hourlyPrice * durationHours);

    /* ---------------------------------------------
       CREATE BOOKING
    --------------------------------------------- */

    const booking = await Booking.create({
      space: space._id,
      user: userId,
      owner: space.owner,
      date: bookingDate,
      startTime,
      endTime,
      guests: guestCount,
      price: hourlyPrice,
      totalPrice,
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    /* ---------------------------------------------
       POPULATE BOOKING
    --------------------------------------------- */

    await booking.populate([
      {
        path: "space",
        select: "name location image workspaceType price capacity",
      },
      {
        path: "user",
        select: "name email phone",
      },
      {
        path: "owner",
        select: "name email phone",
      },
    ]);

    /* ---------------------------------------------
       OWNER NOTIFICATION
    --------------------------------------------- */

    try {
      await Notification.create({
        user: space.owner,
        title: "New Booking Request",
        message: `${
          req.user?.name || "A customer"
        } requested to book ${space.name}.`,
        type: "booking",
        booking: booking._id,
      });
    } catch (notificationError) {
      console.error("Owner notification error:", notificationError);
    }

    /* ---------------------------------------------
       SUCCESS
    --------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

/* =========================================================
   GET MY BOOKINGS
========================================================= */

const getMyBookings = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookings = await Booking.find({
      user: userId,
    })
      .populate("space", "name location image workspaceType price capacity")
      .populate("owner", "name email phone")
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

/* =========================================================
   GET OWNER BOOKINGS
========================================================= */

const getOwnerBookings = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookings = await Booking.find({
      owner: userId,
    })
      .populate("space", "name location image workspaceType price capacity")
      .populate("user", "name email phone")
      .sort({
        date: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get owner bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner bookings",
      error: error.message,
    });
  }
};

/* =========================================================
   GET BOOKING BY ID
========================================================= */

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("space", "name location image workspaceType price capacity")
      .populate("user", "name email phone")
      .populate("owner", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingUserId = booking.user?._id?.toString();

    const bookingOwnerId = booking.owner?._id?.toString();

    const isUser = bookingUserId === userId;

    const isOwner = bookingOwnerId === userId;

    if (!isUser && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    /* ---------------------------------------------
       OWNER CHECK
    --------------------------------------------- */

    if (booking.owner?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this booking",
      });
    }

    /* ---------------------------------------------
       ONLY PENDING BOOKINGS CAN CHANGE
    --------------------------------------------- */

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`,
      });
    }

    /* ---------------------------------------------
       FINAL CONFLICT CHECK BEFORE CONFIRMING
    --------------------------------------------- */

    if (status === "confirmed") {
      const requestedStart = timeToMinutes(booking.startTime);

      const requestedEnd = timeToMinutes(booking.endTime);

      if (requestedStart === null || requestedEnd === null) {
        return res.status(400).json({
          success: false,
          message: "Booking contains invalid time data",
        });
      }

      const existingConfirmedBookings = await Booking.find({
        _id: {
          $ne: booking._id,
        },
        space: booking.space,
        date: booking.date,
        status: "confirmed",
      }).select("_id startTime endTime");

      const conflictBooking = findConflictBooking(
        existingConfirmedBookings,
        requestedStart,
        requestedEnd,
      );

      if (conflictBooking) {
        return res.status(409).json({
          success: false,
          message:
            "This time slot has already been confirmed for another booking",
        });
      }
    }

    /* ---------------------------------------------
       UPDATE STATUS
    --------------------------------------------- */

    booking.status = status;

    await booking.save();

    /* ---------------------------------------------
       USER NOTIFICATION
    --------------------------------------------- */

    try {
      await Notification.create({
        user: booking.user,
        title:
          status === "confirmed" ? "Booking Confirmed" : "Booking Rejected",
        message:
          status === "confirmed"
            ? "Your workspace booking has been confirmed."
            : "Your workspace booking has been rejected.",
        type: "booking",
        booking: booking._id,
      });
    } catch (notificationError) {
      console.error("Booking notification error:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

/* =========================================================
   CANCEL BOOKING
========================================================= */

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isUser = booking.user?.toString() === userId;

    const isOwner = booking.owner?.toString() === userId;

    if (!isUser && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking",
      });
    }

    if (["cancelled", "rejected", "completed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled because it is ${booking.status}`,
      });
    }

    /* ---------------------------------------------
       CANCEL BOOKING
    --------------------------------------------- */

    booking.status = "cancelled";
    booking.cancelledBy = userId;
    booking.cancelledAt = new Date();

    await booking.save();

    /* ---------------------------------------------
       NOTIFY OTHER PARTY
    --------------------------------------------- */

    const notificationUser = isUser ? booking.owner : booking.user;

    try {
      await Notification.create({
        user: notificationUser,
        title: "Booking Cancelled",
        message: "A workspace booking has been cancelled.",
        type: "booking",
        booking: booking._id,
      });
    } catch (notificationError) {
      console.error("Cancel notification error:", notificationError);
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

/* =========================================================
   CHECK BOOKING AVAILABILITY
========================================================= */

const checkAvailability = async (req, res) => {
  try {
    const { space: spaceId, date, startTime, endTime } = req.query;

    /* ---------------------------------------------
       REQUIRED FIELDS
    --------------------------------------------- */

    if (!spaceId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Space, date, start time and end time are required",
      });
    }

    /* ---------------------------------------------
       SPACE ID
    --------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    /* ---------------------------------------------
       DATE
    --------------------------------------------- */

    const bookingDate = normalizeDate(date);

    if (!bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date. Use YYYY-MM-DD",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    /* ---------------------------------------------
       TIME
    --------------------------------------------- */

    const startMinutes = timeToMinutes(startTime);

    const endMinutes = timeToMinutes(endTime);

    if (
      startMinutes === null ||
      endMinutes === null ||
      endMinutes <= startMinutes
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid time range",
      });
    }

    /* ---------------------------------------------
       SPACE
    --------------------------------------------- */

    const space = await Space.findById(spaceId);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (space.availability !== "available") {
      return res.status(200).json({
        success: true,
        available: false,
        message: "This workspace is currently unavailable",
      });
    }

    /* ---------------------------------------------
       FIND BOOKINGS
    --------------------------------------------- */

    const bookings = await Booking.find({
      space: spaceId,
      date: bookingDate,
      status: {
        $in: ["pending", "confirmed"],
      },
    }).select("_id user startTime endTime status");

    /* ---------------------------------------------
       CHECK CONFLICT
    --------------------------------------------- */

    const conflictBooking = findConflictBooking(
      bookings,
      startMinutes,
      endMinutes,
    );

    const available = !conflictBooking;

    return res.status(200).json({
      success: true,
      available,
    });
  } catch (error) {
    console.error("Check availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check availability",
      error: error.message,
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

export {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
};
