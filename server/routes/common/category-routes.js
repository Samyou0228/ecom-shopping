const express = require("express");

const {
  getCategories,
  getBrands,
} = require("../../controllers/common/category-controller");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/brands", getBrands);

module.exports = router;

