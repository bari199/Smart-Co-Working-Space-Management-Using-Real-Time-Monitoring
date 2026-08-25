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

// Public Routes
router.get("/", getAllSpaces);

router.get("/search", searchSpaces);

// Owner Routes
router.get("/owner", protect, authorizeRoles("owner"), getMySpaces);

router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  upload.single("image"),
  createSpace,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("owner"),
  upload.single("image"),
  updateSpace,
);

router.delete("/:id", protect, authorizeRoles("owner"), deleteSpace);

// Single workspace
router.get("/:id", getSpaceById);

export default router;
