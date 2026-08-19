import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "replied", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
