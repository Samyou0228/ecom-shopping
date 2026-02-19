const express = require("express");

const {
  createCategory,
  createBrand,
} = require("../../controllers/common/category-controller");
const {
  authMiddleware,
  isSuperAdmin,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/categories", authMiddleware, isSuperAdmin, createCategory);
router.post("/brands", authMiddleware, isSuperAdmin, createBrand);

module.exports = router;

