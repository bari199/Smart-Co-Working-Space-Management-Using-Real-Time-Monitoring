import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
