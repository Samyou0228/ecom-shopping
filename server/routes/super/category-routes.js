const express = require("express");

const {
  createCategory,
  createBrand,
  uploadCategoryImage,
} = require("../../controllers/common/category-controller");
const {
  authMiddleware,
  isSuperAdmin,
} = require("../../controllers/auth/auth-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/categories", authMiddleware, isSuperAdmin, createCategory);
router.post("/brands", authMiddleware, isSuperAdmin, createBrand);
router.post(
  "/categories/upload-image",
  authMiddleware,
  isSuperAdmin,
  upload.single("my_file"),
  uploadCategoryImage
);

module.exports = router;
