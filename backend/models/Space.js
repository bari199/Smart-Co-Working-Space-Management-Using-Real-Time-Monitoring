// models/Space.js

import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 1,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    workspaceType: {
      type: String,
      enum: [
        "private cabin",
        "shared desk",
        "dedicated desk",
        "hot desk",
        "meeting room",
        "conference room",
        "training room",
        "virtual office",
        "event space",
        "board room",
      ],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    image: {
      type: String,
      default: "",
    },

    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

const Space = mongoose.model("Space", spaceSchema);

export default Space;
