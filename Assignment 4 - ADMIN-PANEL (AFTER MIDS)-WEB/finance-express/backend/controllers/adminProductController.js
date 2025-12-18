// backend/controllers/adminProductController.js
const mongoose = require("mongoose");
const Product = require("../models/Product");

/**
 * @desc    Get all products (Admin)
 * @route   GET /api/admin/products
 * @access  Private (Admin)
 */
exports.listProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Admin listProducts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};

/**
 * @desc    Get single product by ID (Admin)
 * @route   GET /api/admin/products/:id
 * @access  Private (Admin)
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Admin getProductById error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
};

/**
 * @desc    Create new product (Admin)
 * @route   POST /api/admin/products
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;

    if (!name || price === undefined || !category || !image || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      image: image.trim(),
      description: description.trim()
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Admin createProduct error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product"
    });
  }
};

/**
 * @desc    Update product (Admin)
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const updates = {};
    ["name", "price", "category", "image", "description"].forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = field === "price"
          ? Number(req.body[field])
          : req.body[field].trim();
      }
    });

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Admin updateProduct error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product"
    });
  }
};

/**
 * @desc    Delete product (Admin)
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Admin deleteProduct error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
};

/**
 * @desc    Get product categories (Admin)
 * @route   GET /api/admin/categories
 * @access  Private (Admin)
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Admin getCategories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};
