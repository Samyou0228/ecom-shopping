const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const { imageUploadUtil } = require("../../helpers/cloudinary");

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-");
}

const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const slug = slugify(name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
      image: image || "",
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while creating category",
    });
  }
};

const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort("name");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching categories",
    });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    const slug = slugify(name);

    const existing = await Brand.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({ name, slug });

    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while creating brand",
    });
  }
};

const getBrands = async (_req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort("name");

    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching brands",
    });
  }
};

const uploadCategoryImage = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  createBrand,
  getBrands,
  uploadCategoryImage,
};

