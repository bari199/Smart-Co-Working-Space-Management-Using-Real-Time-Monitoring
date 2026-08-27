import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

/*
========================================================
HELPER
========================================================
*/

const getUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  location: user.location,
  profilePicture: user.profilePicture,
});

/*
========================================================
REGISTER USER
POST /api/auth/register
Content-Type: multipart/form-data
========================================================
*/

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, location } = req.body;

    /*
    ----------------------------------------------------
    Validate required fields
    ----------------------------------------------------
    */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    /*
    ----------------------------------------------------
    Normalize email
    ----------------------------------------------------
    */

    const normalizedEmail = email.trim().toLowerCase();

    /*
    ----------------------------------------------------
    Check existing user
    ----------------------------------------------------
    */

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    /*
    ----------------------------------------------------
    Hash password
    ----------------------------------------------------
    */

    const hashedPassword = await bcrypt.hash(password, 10);

    /*
    ----------------------------------------------------
    Role
    ----------------------------------------------------
    */

    const allowedRole = role === "owner" ? "owner" : "user";

    /*
    ----------------------------------------------------
    Profile picture
    ----------------------------------------------------
    */

    let profilePicture = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "smart-coworking/profiles",
      );

      profilePicture = uploadResult.secure_url;
    }

    /*
    ----------------------------------------------------
    Create user
    ----------------------------------------------------
    */

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || "",
      role: allowedRole,
      location: location?.trim() || "",
      profilePicture,
    });

    /*
    ----------------------------------------------------
    Generate token
    ----------------------------------------------------
    */

    const token = generateToken(user._id);

    /*
    ----------------------------------------------------
    Response
    ----------------------------------------------------
    */

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/*
========================================================
LOGIN USER
POST /api/auth/login
========================================================
*/

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/*
========================================================
GET CURRENT USER
GET /api/auth/me
========================================================
*/

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

/*
========================================================
UPDATE USER PROFILE
PUT /api/auth/profile
Content-Type: multipart/form-data

Fields:
name
email
phone
location
profilePicture
========================================================
*/

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, phone, location } = req.body;

    /*
    ----------------------------------------------------
    Validate name
    ----------------------------------------------------
    */

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    /*
    ----------------------------------------------------
    Validate email
    ----------------------------------------------------
    */

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already being used by another account",
        });
      }

      user.email = normalizedEmail;
    }

    /*
    ----------------------------------------------------
    Phone
    ----------------------------------------------------
    */

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    /*
    ----------------------------------------------------
    Location
    ----------------------------------------------------
    */

    if (location !== undefined) {
      user.location = location.trim();
    }

    /*
    ----------------------------------------------------
    Profile Image
    ----------------------------------------------------
    */

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "smart-coworking/profiles",
      );

      user.profilePicture = uploadResult.secure_url;
    }

    /*
    ----------------------------------------------------
    Save
    ----------------------------------------------------
    */

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/*
========================================================
CHANGE PASSWORD
PUT /api/auth/change-password
Content-Type: application/json
========================================================

Body:
{
  currentPassword,
  newPassword,
  confirmPassword
}
========================================================
*/

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    /*
    ----------------------------------------------------
    Validate
    ----------------------------------------------------
    */

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please confirm your new password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    /*
    ----------------------------------------------------
    Find user with password
    ----------------------------------------------------
    */

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
    ----------------------------------------------------
    Check current password
    ----------------------------------------------------
    */

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    /*
    ----------------------------------------------------
    Prevent same password
    ----------------------------------------------------
    */

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    /*
    ----------------------------------------------------
    Hash new password
    ----------------------------------------------------
    */

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};


