import mongoose from "mongoose";

import Space from "../models/Space.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// Create Workspace
export const createSpace = async (req, res) => {
  try {
    console.log("========== SPACE CREATE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("==================================");
    const {
      name,
      description,
      location,
      area,
      capacity,
      workspaceType,
      price,
      amenities,
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      !area ||
      !capacity ||
      !workspaceType ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required workspace details",
      });
    }

    // Workspace image is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Workspace image is required",
      });
    }

    // Upload workspace image to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "smart-coworking/spaces",
    );

    const image = uploadResult.secure_url;

    const space = await Space.create({
      name: name.trim(),
      description: description.trim(),
      owner: req.user._id,
      location: location.trim(),
      area,
      capacity,
      workspaceType,
      price,
      amenities: Array.isArray(amenities)
        ? amenities
        : amenities
          ? amenities.split(",").map((item) => item.trim())
          : [],
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      space,
    });
  } catch (error) {
    console.error("CREATE SPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create workspace",
      error: error.message,
    });
  }
};
// Get All Workspaces
export const getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find()
      .populate("owner", "name email profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: spaces.length,
      spaces,
    });
  } catch (error) {
    console.error("GET ALL SPACES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces",
      error: error.message,
    });
  }
};

// Get Single Workspace
export const getSpaceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const space = await Space.findById(req.params.id).populate(
      "owner",
      "name email phone profilePicture",
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
    console.error("GET SPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspace",
      error: error.message,
    });
  }
};

// Get Owner Workspaces
export const getMySpaces = async (req, res) => {
  try {
    const spaces = await Space.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: spaces.length,
      spaces,
    });
  } catch (error) {
    console.error("GET MY SPACES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your workspaces",
      error: error.message,
    });
  }
};

// Update Workspace
export const updateSpace = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const space = await Space.findById(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own workspace",
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

    space.name = name?.trim() || space.name;
    space.description = description?.trim() || space.description;
    space.location = location?.trim() || space.location;
    space.area = area ?? space.area;
    space.capacity = capacity ?? space.capacity;
    space.workspaceType = workspaceType || space.workspaceType;
    space.price = price ?? space.price;
    space.availability = availability || space.availability;

    if (amenities !== undefined) {
      space.amenities = Array.isArray(amenities)
        ? amenities
        : amenities
          ? amenities.split(",").map((item) => item.trim())
          : [];
    }

    // Upload new workspace image
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "smart-coworking/spaces",
      );

      space.image = uploadResult.secure_url;
    }

    await space.save();

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      space,
    });
  } catch (error) {
    console.error("UPDATE SPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update workspace",
      error: error.message,
    });
  }
};

// Delete Workspace
export const deleteSpace = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const space = await Space.findById(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (space.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own workspace",
      });
    }

    await space.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete workspace",
      error: error.message,
    });
  }
};

// Search and Smart Match Workspaces
export const searchSpaces = async (req, res) => {
  try {
    const { persons, area, budget, location, amenities, workspaceType } =
      req.query;

    const spaces = await Space.find({
      availability: "available",
    })
      .populate("owner", "name email profilePicture")
      .sort({ createdAt: -1 });

    const requestedPersons = persons ? Number(persons) : null;
    const requestedArea = area ? Number(area) : null;
    const requestedBudget = budget ? Number(budget) : null;

    const requestedAmenities = amenities
      ? amenities
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const results = spaces
      .map((space) => {
        let score = 0;

        // Capacity - 25%
        if (requestedPersons === null || space.capacity >= requestedPersons) {
          score += 25;
        }

        // Area - 20%
        if (requestedArea === null || space.area >= requestedArea) {
          score += 20;
        }

        // Budget - 20%
        if (requestedBudget === null || space.price <= requestedBudget) {
          score += 20;
        }

        // Location - 20%
        if (
          !location ||
          space.location.toLowerCase().includes(location.toLowerCase())
        ) {
          score += 20;
        }

        // Amenities - 10%
        if (requestedAmenities.length === 0) {
          score += 10;
        } else {
          const spaceAmenities = space.amenities.map((item) =>
            item.toLowerCase(),
          );

          const matchedAmenities = requestedAmenities.filter((item) =>
            spaceAmenities.includes(item),
          );

          const amenityScore =
            (matchedAmenities.length / requestedAmenities.length) * 10;

          score += amenityScore;
        }

        // Workspace Type - 5%
        if (
          !workspaceType ||
          space.workspaceType.toLowerCase() === workspaceType.toLowerCase()
        ) {
          score += 5;
        }

        return {
          ...space.toObject(),
          matchScore: Math.round(score),
        };
      })
      .filter((space) => space.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: results.length,
      filters: {
        persons: requestedPersons,
        area: requestedArea,
        budget: requestedBudget,
        location: location || "",
        amenities: requestedAmenities,
        workspaceType: workspaceType || "",
      },
      spaces: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search workspaces",
      error: error.message,
    });
  }
};
