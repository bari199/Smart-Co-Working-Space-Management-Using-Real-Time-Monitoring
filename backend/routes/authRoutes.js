import express from "express";

import { registerUser, loginUser } from "../controllers/authController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), registerUser);

router.post("/login", loginUser);

export default router;
