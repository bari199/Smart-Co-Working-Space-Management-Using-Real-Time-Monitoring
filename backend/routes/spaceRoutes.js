import express from "express";

import {
  createSpace,
  getAllSpaces,
  getSpaceById,
  getMySpaces,
  updateSpace,
  deleteSpace,
  searchSpaces,
} from "../controllers/spaceController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get all workspaces
router.get("/", getAllSpaces);

// Search workspaces
router.get("/search", searchSpaces);

// Get owner's workspaces
router.get("/owner/my-spaces", protect, authorizeRoles("owner"), getMySpaces);

// Get single workspace
router.get("/:id", getSpaceById);

// Create workspace
router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  upload.single("image"),
  createSpace,
);

// Update workspace
router.put(
  "/:id",
  protect,
  authorizeRoles("owner"),
  upload.single("image"),
  updateSpace,
);

// Delete workspace
router.delete("/:id", protect, authorizeRoles("owner"), deleteSpace);

export default router;
