import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
========================================================
REGISTER
POST /api/auth/register
========================================================
*/

router.post("/register", upload.single("profilePicture"), registerUser);

/*
========================================================
LOGIN
POST /api/auth/login
========================================================
*/

router.post("/login", loginUser);

/*
========================================================
GET CURRENT USER
GET /api/auth/me
========================================================
*/

router.get("/me", authMiddleware, getCurrentUser);

/*
========================================================
UPDATE PROFILE
PUT /api/auth/profile

Content-Type: multipart/form-data

Fields:
- name
- email
- phone
- location
- profilePicture
========================================================
*/

router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfile,
);

/*
========================================================
CHANGE PASSWORD
PUT /api/auth/change-password

Content-Type: application/json

Body:
{
  currentPassword,
  newPassword,
  confirmPassword
}
========================================================
*/

router.put("/change-password", authMiddleware, changePassword);

export default router;
