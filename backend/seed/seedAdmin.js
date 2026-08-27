import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    if (ADMIN_ROLE !== "admin") {
      throw new Error("ADMIN_ROLE must be 'admin'");
    }

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase(),
    });

    if (existingAdmin) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    console.log("=================================");
    console.log("Admin created successfully");
    console.log("=================================");
    console.log("Name:", admin.name);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Database:", admin.db?.name || "Connected database");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("SEED ERROR:", error.message);
    process.exit(1);
  }
};

seedAdmin();
