const express = require("express");

const {
  createCategory,
  createBrand,
  uploadCategoryImage,
  updateCategory,
  deleteCategory,
  updateBrand,
  deleteBrand,
} = require("../../controllers/common/category-controller");
const {
  authMiddleware,
  isSuperAdmin,
} = require("../../controllers/auth/auth-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/categories", authMiddleware, isSuperAdmin, createCategory);
router.put("/categories/:id", authMiddleware, isSuperAdmin, updateCategory);
router.delete("/categories/:id", authMiddleware, isSuperAdmin, deleteCategory);

router.post("/brands", authMiddleware, isSuperAdmin, createBrand);
router.put("/brands/:id", authMiddleware, isSuperAdmin, updateBrand);
router.delete("/brands/:id", authMiddleware, isSuperAdmin, deleteBrand);

router.post(
  "/categories/upload-image",
  authMiddleware,
  isSuperAdmin,
  upload.single("my_file"),
  uploadCategoryImage
);

module.exports = router;
