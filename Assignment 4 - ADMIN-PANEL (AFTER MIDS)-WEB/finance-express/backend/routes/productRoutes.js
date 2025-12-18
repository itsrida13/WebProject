const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/* ===========================
   ROOT & STATIC PAGES
=========================== */

// Root → login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { layout: false });
});

// Home page
router.get('/home', (req, res) => {
  res.render('index');
});

// Cart page
router.get('/cart', (req, res) => {
  res.render('cart');
});

// Checkout page
router.get('/checkout', (req, res) => {
  res.render('checkout');
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Gallery page
router.get('/gallery', (req, res) => {
  res.render('gallery');
});

// Thank you page
router.get('/thankyou', (req, res) => {
  res.render('thankyou');
});

// Admin UI – redirect to React admin panel (Vite dev server)
router.get('/admin', (req, res) => {
  // If the admin-panel dev server is running, this will open the React admin UI
  return res.redirect('http://localhost:5173');
});

/* ===========================
   MENU PAGE (FILTER + SORT + PAGINATION)
=========================== */

router.get('/menu', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1
    } = req.query;

    const limit = 9;
    const skip = (page - 1) * limit;

    /* -------- FILTER QUERY -------- */
    let query = {};

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    /* -------- SORT LOGIC -------- */
    let sortOption = { createdAt: -1 }; // default newest first

    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    /* -------- FETCH PRODUCTS -------- */
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    /* -------- PAGINATION DATA -------- */
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    /* -------- FILTER OPTIONS -------- */
    const categories = await Product.distinct('category');

    /* -------- RENDER -------- */
    res.render('menu', {
      products,
      categories,
      selectedCategory: category || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      selectedSort: sort || '',
      currentPage: Number(page),
      totalPages,
      totalProducts
    });

  } catch (error) {
    console.error('Error loading menu:', error);
    res.status(500).send('Error loading products');
  }
});

module.exports = router;
