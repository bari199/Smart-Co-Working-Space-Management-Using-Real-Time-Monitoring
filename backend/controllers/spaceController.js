import mongoose from "mongoose";
import Space from "../models/Space.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const createSpace = async (req, res) => {
  try {
    console.log("========== CREATE SPACE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("BUFFER SIZE:", req.file?.buffer?.length);

    const {
      name,
      description,
      location,
      area,
      capacity,
      workspaceType,
      price,
      amenities,
      availability,
    } = req.body;

    if (
      !name ||
      !description ||
      !location ||
      !area ||
      !capacity ||
      !workspaceType ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    let imageUrl = "";

    if (req.file) {
      console.log("Uploading image to Cloudinary...");

      const result = await uploadToCloudinary(
        req.file.buffer,
        "smart-coworking/spaces",
      );

      console.log("Cloudinary result:", result);

      imageUrl = result.secure_url;

      console.log("IMAGE URL:", imageUrl);
    }

    const space = await Space.create({
      name: name.trim(),
      description: description.trim(),
      owner: req.user._id,
      location: location.trim(),
      area: Number(area),
      capacity: Number(capacity),
      workspaceType,
      price: Number(price),

      amenities: Array.isArray(amenities)
        ? amenities
        : amenities
          ? String(amenities)
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],

      image: imageUrl,

      availability: availability || "available",
    });

    console.log("SAVED SPACE:", space);

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      space,
    });
  } catch (error) {
    console.error("Create space error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create workspace",
      error: error.message,
    });
  }
};

const getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find({
      availability: "available",
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: spaces.length,
      spaces,
    });
  } catch (error) {
    console.error("Get all spaces error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
      error: error.message,
    });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const space = await Space.findById(id).populate(
      "owner",
      "name email phone location",
    );

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    return res.status(200).json({
      success: true,
      space,
    });
  } catch (error) {
    console.error("Get space by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspace",
      error: error.message,
    });
  }
};

const getMySpaces = async (req, res) => {
  try {
    console.log("GET MY SPACES");
    console.log("USER:", req.user);
    console.log("USER ID:", req.user?._id);
    console.log("USER ROLE:", req.user?.role);

    const spaces = await Space.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: spaces.length,
      spaces,
    });
  } catch (error) {
    console.error("Get owner spaces error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your workspaces",
      error: error.message,
    });
  }
};
const updateSpace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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

    if (space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this workspace",
      });
    }

    const {
      name,
      description,
      location,
      area,
      capacity,
      workspaceType,
      price,
      amenities,
      availability,
    } = req.body;

    if (name !== undefined) {
      space.name = name.trim();
    }

    if (description !== undefined) {
      space.description = description.trim();
    }

    if (location !== undefined) {
      space.location = location.trim();
    }

    if (area !== undefined) {
      space.area = Number(area);
    }

    if (capacity !== undefined) {
      space.capacity = Number(capacity);
    }

    if (workspaceType !== undefined) {
      space.workspaceType = workspaceType;
    }

    if (price !== undefined) {
      space.price = Number(price);
    }

    if (amenities !== undefined) {
      space.amenities = Array.isArray(amenities)
        ? amenities
        : String(amenities)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (availability !== undefined) {
      space.availability = availability;
    }

    if (req.file?.path) {
      space.image = req.file.path;
    }

    await space.save();

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      space,
    });
  } catch (error) {
    console.error("Update space error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update workspace",
      error: error.message,
    });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
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

    if (space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this workspace",
      });
    }

    await Space.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("Delete space error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete workspace",
      error: error.message,
    });
  }
};

const searchSpaces = async (req, res) => {
  try {
    const {
      search,
      location,
      workspaceType,
      minPrice,
      maxPrice,
      capacity,
      availability,
    } = req.query;

    const filter = {};

    if (availability) {
      filter.availability = availability;
    } else {
      filter.availability = "available";
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (workspaceType) {
      filter.workspaceType = workspaceType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (capacity !== undefined) {
      filter.capacity = {
        $gte: Number(capacity),
      };
    }

    const spaces = await Space.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: spaces.length,
      spaces,
    });
  } catch (error) {
    console.error("Search spaces error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search workspaces",
      error: error.message,
    });
  }
};

const getSearchOptions = async (req, res) => {
  try {
    const locations = await Space.distinct("location", {
      availability: "available",
      location: { $nin: ["", null] },
    });

    const workspaceTypes = await Space.distinct("workspaceType", {
      availability: "available",
      workspaceType: { $nin: ["", null] },
    });

    return res.status(200).json({
      success: true,
      locations: locations.sort((a, b) => a.localeCompare(b)),
      workspaceTypes: workspaceTypes.sort((a, b) => a.localeCompare(b)),
    });
  } catch (error) {
    console.error("Get search options error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch search options",
      error: error.message,
    });
  }
};

export {
  createSpace,
  getAllSpaces,
  getSpaceById,
  getMySpaces,
  getSearchOptions,
  updateSpace,
  deleteSpace,
  searchSpaces,
};
