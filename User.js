// models/User.js - User Schema & Model

const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No duplicate emails
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },

    address: {
      street: { type: String, trim: true },
      city:   { type: String, trim: true },
      state:  { type: String, trim: true },
      pincode:{ type: String, trim: true },
    },

    role: {
      type: String,
      enum: ["customer", "admin"],  // Only these two values allowed
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Auto-adds createdAt and updatedAt fields
  }
);

// Create and export the Model
const User = mongoose.model("User", userSchema);

module.exports = User;
