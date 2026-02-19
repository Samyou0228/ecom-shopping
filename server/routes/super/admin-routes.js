const express = require("express");
const User = require("../../models/User");
const {
  authMiddleware,
  isSuperAdmin,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/pending", authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const pendingAdmins = await User.find({
      role: "admin",
      isApproved: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: pendingAdmins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching pending admins",
    });
  }
});

router.get("/summary", authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const [totalAdmins, approvedAdmins, pendingAdmins, blockedAdmins] =
      await Promise.all([
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "admin", isApproved: true }),
        User.countDocuments({ role: "admin", isApproved: false }),
        User.countDocuments({ role: "admin", isBlocked: true }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalAdmins,
        approvedAdmins,
        pendingAdmins,
        blockedAdmins,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching admin summary",
    });
  }
});

router.get("/all", authMiddleware, isSuperAdmin, async (_req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching admins",
    });
  }
});

router.post(
  "/approve/:id",
  authMiddleware,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await User.findOneAndUpdate(
        { _id: id, role: "admin" },
        { isApproved: true },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin approved successfully",
        data: updated,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error while approving admin",
      });
    }
  }
);

router.post(
  "/decline/:id",
  authMiddleware,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await User.findOneAndDelete({
        _id: id,
        role: "admin",
        isApproved: false,
      }).select("-password");

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Admin not found or already approved",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin request declined and user removed",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error while declining admin",
      });
    }
  }
);

router.post(
  "/block/:id",
  authMiddleware,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await User.findOneAndUpdate(
        { _id: id, role: "admin" },
        { isBlocked: true },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin blocked successfully",
        data: updated,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error while blocking admin",
      });
    }
  }
);

router.post(
  "/unblock/:id",
  authMiddleware,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await User.findOneAndUpdate(
        { _id: id, role: "admin" },
        { isBlocked: false },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin unblocked successfully",
        data: updated,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error while unblocking admin",
      });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await User.findOneAndDelete({
        _id: id,
        role: "admin",
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error while deleting admin",
      });
    }
  }
);

module.exports = router;
