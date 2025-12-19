// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { applyDiscount } = require('../middleware/discountMiddleware');

// Order preview page (with optional discount)
router.get('/preview', applyDiscount, orderController.showOrderPreview);

// Confirm and create order (applies discount before saving)
router.post('/confirm', applyDiscount, orderController.confirmOrder);

// Order success page
router.get('/success', orderController.orderSuccess);

// Customer order history page (shows form)
router.get('/my-orders', orderController.showMyOrders);

// Fetch orders by email (form submission)
router.post('/my-orders', orderController.getMyOrders);

module.exports = router;