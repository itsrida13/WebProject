// backend/routes/adminOrderRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  deleteOrder
} = require('../controllers/adminOrderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes require authentication and admin role
router.use(protect, isAdmin);

// GET /api/admin/orders/stats - Get order statistics
router.get('/orders/stats', getOrderStats);

// GET /api/admin/orders - Get all orders (with filtering)
router.get('/orders', getAllOrders);

// GET /api/admin/orders/:id - Get single order
router.get('/orders/:id', getOrderById);

// PATCH /api/admin/orders/:id/status - Update order status
router.patch('/orders/:id/status', updateOrderStatus);

// DELETE /api/admin/orders/:id - Delete order
router.delete('/orders/:id', deleteOrder);

module.exports = router;