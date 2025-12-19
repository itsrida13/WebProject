// backend/routes/adminProductRoutes.js
const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");

const ctrl = require("../controllers/adminProductController");


// all routes require admin
router.use(protect, isAdmin);

router.get("/products", ctrl.listProducts);
router.get("/products/:id", ctrl.getProductById);
router.post("/products", ctrl.createProduct);
router.put("/products/:id", ctrl.updateProduct);
router.delete("/products/:id", ctrl.deleteProduct);

router.get("/categories", ctrl.getCategories);

module.exports = router;
