// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /test-products → returns all products in JSON
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
