// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getProfile,
  logoutAdmin,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Base route – simple health check / info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API is running',
    routes: {
      register: 'POST /api/admin/register',
      login: 'POST /api/admin/login',
      profile: 'GET /api/admin/profile',
      logout: 'POST /api/admin/logout',
      dashboard: 'GET /api/admin/dashboard'
    }
  });
});

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logoutAdmin);
router.get('/dashboard', protect, isAdmin, getDashboardStats);

module.exports = router; 
