import mongoose from "mongoose";
import User from "../models/User.js";
import Space from "../models/Space.js";
import Booking from "../models/Booking.js";
import Inquiry from "../models/Inquiry.js";
import Payment from "../models/Payments.js";

/*
=========================================================
HELPERS
=========================================================
*/

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/*
=========================================================
ADMIN DASHBOARD
GET /api/admin/dashboard
=========================================================
*/

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalAdmins,
      totalSpaces,
      availableSpaces,
      unavailableSpaces,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalInquiries,
      pendingInquiries,
      repliedInquiries,
      totalPayments,
      paidPayments,
      failedPayments,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),

      User.countDocuments({ role: "owner" }),

      User.countDocuments({ role: "admin" }),

      Space.countDocuments(),

      Space.countDocuments({
        availability: "available",
      }),

      Space.countDocuments({
        availability: "unavailable",
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: "pending",
      }),

      Booking.countDocuments({
        status: "confirmed",
      }),

      Booking.countDocuments({
        status: "cancelled",
      }),

      Inquiry.countDocuments(),

      Inquiry.countDocuments({
        status: "pending",
      }),

      Inquiry.countDocuments({
        status: "replied",
      }),

      Payment.countDocuments(),

      Payment.countDocuments({
        status: "paid",
      }),

      Payment.countDocuments({
        status: "failed",
      }),

      Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,

      dashboard: {
        users: {
          total: totalUsers,
          customers: totalUsers,
          owners: totalOwners,
          admins: totalAdmins,
        },

        spaces: {
          total: totalSpaces,
          available: availableSpaces,
          unavailable: unavailableSpaces,
        },

        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },

        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries,
          replied: repliedInquiries,
        },

        payments: {
          total: totalPayments,
          paid: paidPayments,
          failed: failedPayments,
          revenue: totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL USERS
GET /api/admin/users
=========================================================
*/

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const filter = {};

    /*
    -----------------------------------------------------
    ROLE FILTER
    -----------------------------------------------------
    */

    if (role && ["user", "owner", "admin"].includes(role)) {
      filter.role = role;
    }

    /*
    -----------------------------------------------------
    SEARCH
    -----------------------------------------------------
    */

    if (search && search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          location: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      count: users.length,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },

      users,
    });
  } catch (error) {
    console.error("ADMIN GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/*
=========================================================
GET SINGLE USER
GET /api/admin/users/:id
=========================================================
*/

export const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [spaces, bookings, inquiries, payments] = await Promise.all([
      Space.find({
        owner: user._id,
      }).sort({
        createdAt: -1,
      }),

      Booking.find({
        user: user._id,
      })
        .populate("space", "name location image")
        .sort({
          createdAt: -1,
        }),

      Inquiry.find({
        user: user._id,
      })
        .populate("space", "name location image")
        .sort({
          createdAt: -1,
        }),

      Payment.find({
        user: user._id,
      })
        .populate("booking")
        .sort({
          createdAt: -1,
        }),
    ]);

    return res.status(200).json({
      success: true,

      user,

      activity: {
        spaces,
        bookings,
        inquiries,
        payments,
      },
    });
  } catch (error) {
    console.error("ADMIN GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

/*
=========================================================
UPDATE USER ROLE
PUT /api/admin/users/:id/role
=========================================================
*/

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!["user", "owner", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    /*
    Prevent admin from changing their own role.
    */

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    const updatedUser = await User.findById(id).select("-password");

    return res.status(200).json({
      success: true,
      message: `User role changed to ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("ADMIN UPDATE ROLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

/*
=========================================================
DELETE USER
DELETE /api/admin/users/:id
=========================================================
*/

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
    -----------------------------------------------------
    Prevent accidental deletion of another admin.
    -----------------------------------------------------
    */

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted from this panel",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("ADMIN DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL OWNERS
GET /api/admin/owners
=========================================================
*/

export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({
      role: "owner",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    const ownersWithStats = await Promise.all(
      owners.map(async (owner) => {
        const [spaces, bookings, revenueResult] = await Promise.all([
          Space.countDocuments({
            owner: owner._id,
          }),

          Booking.countDocuments({
            owner: owner._id,
          }),

          Booking.aggregate([
            {
              $match: {
                owner: owner._id,
                paymentStatus: "paid",
              },
            },
            {
              $group: {
                _id: null,
                revenue: {
                  $sum: "$totalPrice",
                },
              },
            },
          ]),
        ]);

        return {
          ...owner.toObject(),

          stats: {
            spaces,
            bookings,
            revenue: revenueResult.length > 0 ? revenueResult[0].revenue : 0,
          },
        };
      }),
    );

    return res.status(200).json({
      success: true,
      count: ownersWithStats.length,
      owners: ownersWithStats,
    });
  } catch (error) {
    console.error("ADMIN GET OWNERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owners",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL SPACES
GET /api/admin/spaces
=========================================================
*/

export const getAdminSpaces = async (req, res) => {
  try {
    const {
      search,
      workspaceType,
      availability,
      owner,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (workspaceType) {
      filter.workspaceType = workspaceType;
    }

    if (availability) {
      filter.availability = availability;
    }

    if (owner && isValidObjectId(owner)) {
      filter.owner = owner;
    }

    if (search && search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          location: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [spaces, total] = await Promise.all([
      Space.find(filter)
        .populate("owner", "name email phone profilePicture")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Space.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      count: spaces.length,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },

      spaces,
    });
  } catch (error) {
    console.error("ADMIN GET SPACES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
      error: error.message,
    });
  }
};

/*
=========================================================
GET SINGLE SPACE
GET /api/admin/spaces/:id
=========================================================
*/

export const getAdminSpaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const space = await Space.findById(id).populate(
      "owner",
      "name email phone location profilePicture",
    );

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const [bookings, inquiries] = await Promise.all([
      Booking.find({
        space: space._id,
      })
        .populate("user", "name email phone")
        .sort({
          createdAt: -1,
        }),

      Inquiry.find({
        space: space._id,
      })
        .populate("user", "name email phone")
        .sort({
          createdAt: -1,
        }),
    ]);

    return res.status(200).json({
      success: true,

      space,

      activity: {
        bookings,
        inquiries,
      },
    });
  } catch (error) {
    console.error("ADMIN GET SPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspace",
      error: error.message,
    });
  }
};

/*
=========================================================
UPDATE SPACE AVAILABILITY
PUT /api/admin/spaces/:id/availability
=========================================================
*/

export const updateSpaceAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    if (!["available", "unavailable"].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability status",
      });
    }

    const space = await Space.findById(id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    space.availability = availability;

    await space.save();

    return res.status(200).json({
      success: true,
      message: `Workspace marked as ${availability}`,
      space,
    });
  } catch (error) {
    console.error("ADMIN UPDATE SPACE AVAILABILITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update workspace availability",
      error: error.message,
    });
  }
};

/*
=========================================================
DELETE SPACE
DELETE /api/admin/spaces/:id
=========================================================
*/

export const deleteAdminSpace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const space = await Space.findById(id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    /*
    -----------------------------------------------------
    Don't delete a workspace with active bookings.
    -----------------------------------------------------
    */

    const activeBookings = await Booking.countDocuments({
      space: id,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: "Workspace cannot be deleted because it has active bookings",
      });
    }

    await Space.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("ADMIN DELETE SPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete workspace",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL BOOKINGS
GET /api/admin/bookings
=========================================================
*/

export const getAdminBookings = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (
      status &&
      ["pending", "confirmed", "rejected", "cancelled", "completed"].includes(
        status,
      )
    ) {
      filter.status = status;
    }

    if (
      paymentStatus &&
      ["pending", "paid", "failed", "refunded"].includes(paymentStatus)
    ) {
      filter.paymentStatus = paymentStatus;
    }

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("user", "name email phone profilePicture")
        .populate("owner", "name email phone profilePicture")
        .populate("space", "name location image workspaceType price capacity")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Booking.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      count: bookings.length,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },

      bookings,
    });
  } catch (error) {
    console.error("ADMIN GET BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

/*
=========================================================
GET SINGLE BOOKING
GET /api/admin/bookings/:id
=========================================================
*/

export const getAdminBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("user", "name email phone profilePicture")
      .populate("owner", "name email phone profilePicture")
      .populate(
        "space",
        "name description location image workspaceType price capacity amenities",
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const payment = await Payment.findOne({
      booking: booking._id,
    });

    return res.status(200).json({
      success: true,
      booking,
      payment,
    });
  } catch (error) {
    console.error("ADMIN GET BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

/*
=========================================================
ADMIN UPDATE BOOKING STATUS
PUT /api/admin/bookings/:id/status
=========================================================
*/

export const updateAdminBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (
      !["pending", "confirmed", "rejected", "cancelled", "completed"].includes(
        status,
      )
    ) {
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

    booking.status = status;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Booking marked as ${status}`,
      booking,
    });
  } catch (error) {
    console.error("ADMIN UPDATE BOOKING STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL INQUIRIES
GET /api/admin/inquiries
=========================================================
*/

export const getAdminInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status && ["pending", "replied", "closed"].includes(status)) {
      filter.status = status;
    }

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate("user", "name email phone profilePicture")
        .populate("space", "name location image workspaceType")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Inquiry.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      count: inquiries.length,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },

      inquiries,
    });
  } catch (error) {
    console.error("ADMIN GET INQUIRIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
};

/*
=========================================================
GET SINGLE INQUIRY
GET /api/admin/inquiries/:id
=========================================================
*/

export const getAdminInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    const inquiry = await Inquiry.findById(id)
      .populate("user", "name email phone profilePicture")
      .populate("space", "name location image workspaceType capacity price");

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error("ADMIN GET INQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL PAYMENTS
GET /api/admin/payments
=========================================================
*/

export const getAdminPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (
      status &&
      ["created", "pending", "paid", "failed", "refunded"].includes(status)
    ) {
      filter.status = status;
    }

    const pageNumber = Math.max(Number(page), 1);

    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [payments, total, revenueResult] = await Promise.all([
      Payment.find(filter)
        .populate("user", "name email phone profilePicture")
        .populate(
          "booking",
          "date startTime endTime status totalPrice space owner",
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber),

      Payment.countDocuments(filter),

      Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,

      count: payments.length,

      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },

      summary: {
        totalRevenue,
      },

      payments,
    });
  } catch (error) {
    console.error("ADMIN GET PAYMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

/*
=========================================================
GET SINGLE PAYMENT
GET /api/admin/payments/:id
=========================================================
*/

export const getAdminPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const payment = await Payment.findById(id)
      .populate("user", "name email phone profilePicture")
      .populate({
        path: "booking",
        populate: [
          {
            path: "space",
            select: "name location image workspaceType price",
          },
          {
            path: "owner",
            select: "name email phone",
          },
          {
            path: "user",
            select: "name email phone",
          },
        ],
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("ADMIN GET PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};
