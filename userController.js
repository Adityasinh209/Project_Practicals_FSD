// controllers/userController.js
// CRUD Operations for Users

const User = require("../models/User");

// CREATE - Register new user
// POST /api/users
const createUser = async (req, res) => {
  try {
    // Check if email already exists
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = new User(req.body);
    const saved = await user.save();

    // Don't return password in response
    const { password, ...userWithoutPassword } = saved.toObject();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// READ - Get all users
// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    // .select("-password") excludes password field from results
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ - Get single user
// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE - Update user profile
// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    // Prevent password update via this route
    delete req.body.password;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE - Delete user
// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
