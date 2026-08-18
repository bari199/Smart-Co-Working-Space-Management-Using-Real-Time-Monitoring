import Booking from "../models/Booking.js";
import Space from "../models/Space.js";

// Create Booking
export const createBooking = async (req, res) => {
  try {
    const { space, date, startTime, endTime, numberOfPersons, message } =
      req.body;

    if (!space || !date || !startTime || !endTime || !numberOfPersons) {
      return res.status(400).json({
        success: false,
        message: "Please provide all booking details",
      });
    }

    const workspace = await Space.findById(space);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (workspace.availability !== "available") {
      return res.status(400).json({
        success: false,
        message: "This workspace is currently unavailable",
      });
    }

    if (Number(numberOfPersons) > workspace.capacity) {
      return res.status(400).json({
        success: false,
        message: `Maximum capacity is ${workspace.capacity} persons`,
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // Check existing bookings
    const existingBookings = await Booking.find({
      space,
      date,
      status: {
        $in: ["pending", "approved"],
      },
    });

    const hasConflict = existingBookings.some((booking) => {
      return startTime < booking.endTime && endTime > booking.startTime;
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: "Workspace is already booked for this time",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      space,
      date,
      startTime,
      endTime,
      numberOfPersons,
      message,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone profilePicture")
      .populate("space", "name location price image");

    res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// User Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("space", "name location price image capacity")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    const spaces = await Space.find({
      owner: req.user._id,
    }).select("_id");

    const spaceIds = spaces.map((space) => space._id);

    const bookings = await Booking.find({
      space: { $in: spaceIds },
    })
      .populate("user", "name email phone profilePicture")
      .populate("space", "name location price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch owner bookings",
      error: error.message,
    });
  }
};

// Approve Booking
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("space");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only manage bookings for your spaces",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved",
      });
    }

    // Check if another booking became approved meanwhile
    const conflictingBooking = await Booking.findOne({
      _id: { $ne: booking._id },
      space: booking.space._id,
      date: booking.date,
      status: "approved",
      startTime: { $lt: booking.endTime },
      endTime: { $gt: booking.startTime },
    });

    if (conflictingBooking) {
      booking.status = "rejected";
      await booking.save();

      return res.status(400).json({
        success: false,
        message:
          "Another booking already exists for this time. Booking rejected.",
      });
    }

    booking.status = "approved";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve booking",
      error: error.message,
    });
  }
};

// Reject Booking
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("space");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only manage bookings for your spaces",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be rejected",
      });
    }

    booking.status = "rejected";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject booking",
      error: error.message,
    });
  }
};

// Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings",
      });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
