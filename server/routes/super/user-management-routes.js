const express = require("express");
const User = require("../../models/User");
const {
  authMiddleware,
  isSuperAdmin,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Get all users (role: 'user')
router.get("/users", authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

// Get all owners (role: 'admin')
router.get("/owners", authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const owners = await User.find({ role: "admin" }).select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: owners,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching owners",
    });
  }
});

module.exports = router;
