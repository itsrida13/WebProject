// backend/controllers/adminController.js
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const { generateToken } = require("../middleware/authMiddleware");

// POST /api/admin/register
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (adminExists) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      role: role || "admin",
    });

    const token = generateToken(admin._id);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Error registering admin" });
  }
};

// POST /api/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Error logging in" });
  }
};

// GET /api/admin/profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    return res.json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

// POST /api/admin/logout
exports.logoutAdmin = (req, res) => {
  res.cookie("adminToken", "", { httpOnly: true, expires: new Date(0) });
  return res.json({ success: true, message: "Logged out successfully" });
};

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct("category");

    const totalRevenueAgg = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

    return res.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories: categories.length,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        categories,
        recentProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching dashboard stats" });
  }
};
