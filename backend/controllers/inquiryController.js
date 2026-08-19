import Inquiry from "../models/Inquiry.js";
import Space from "../models/Space.js";
import Notification from "../models/Notification.js";

// Create Inquiry
export const createInquiry = async (req, res) => {
  try {
    const { space, message } = req.body;

    if (!space || !message) {
      return res.status(400).json({
        success: false,
        message: "Workspace and message are required",
      });
    }

    const workspace = await Space.findById(space);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const inquiry = await Inquiry.create({
      user: req.user._id,
      space,
      message,
    });

    // Notify workspace owner
    await Notification.create({
      user: workspace.owner,
      title: "New Workspace Inquiry",
      message: `${req.user.name} sent an inquiry about ${workspace.name}`,
      type: "inquiry",
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate("user", "name email profilePicture")
      .populate("space", "name location image");

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      inquiry: populatedInquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry",
      error: error.message,
    });
  }
};

// User Inquiries
export const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      user: req.user._id,
    })
      .populate("space", "name location image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
};

// Owner Inquiries
export const getOwnerInquiries = async (req, res) => {
  try {
    const spaces = await Space.find({
      owner: req.user._id,
    }).select("_id");

    const spaceIds = spaces.map((space) => space._id);

    const inquiries = await Inquiry.find({
      space: { $in: spaceIds },
    })
      .populate("user", "name email phone profilePicture")
      .populate("space", "name location image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch owner inquiries",
      error: error.message,
    });
  }
};

// Reply to Inquiry
export const replyToInquiry = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const inquiry = await Inquiry.findById(req.params.id).populate("space");

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    if (inquiry.space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only reply to inquiries for your spaces",
      });
    }

    inquiry.reply = reply;
    inquiry.status = "replied";

    await inquiry.save();

    // Notify user
    await Notification.create({
      user: inquiry.user,
      title: "Inquiry Response",
      message: `The owner replied to your inquiry about ${inquiry.space.name}`,
      type: "inquiry",
    });

    const updatedInquiry = await Inquiry.findById(inquiry._id)
      .populate("user", "name email profilePicture")
      .populate("space", "name location image");

    res.status(200).json({
      success: true,
      message: "Inquiry replied successfully",
      inquiry: updatedInquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reply to inquiry",
      error: error.message,
    });
  }
};

// Close Inquiry
export const closeInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("space");

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    const isUser = inquiry.user.toString() === req.user._id.toString();

    const isOwner = inquiry.space.owner.toString() === req.user._id.toString();

    if (!isUser && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot close this inquiry",
      });
    }

    inquiry.status = "closed";

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Inquiry closed successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to close inquiry",
      error: error.message,
    });
  }
};
