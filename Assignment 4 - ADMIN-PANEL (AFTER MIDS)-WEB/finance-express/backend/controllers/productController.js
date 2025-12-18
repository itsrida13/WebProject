// controllers/productController.js
console.log('✅ ProductController loaded at:', new Date().toISOString());

const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  console.log('🎯 getProducts function called');
  
  try {
    console.log('📥 Query params:', req.query);

    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);

    // Build filter object
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    console.log('🔍 Filter:', filter);

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    console.log('📊 Total products:', totalProducts, 'Total pages:', totalPages);

    // Fetch products with filters and pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit);

    console.log('✅ Products fetched:', products.length);

    // Get all unique categories for filter dropdown
    let categories = [];
    try {
      categories = await Product.distinct('category');
      console.log('✅ Categories found:', categories);
    } catch (catErr) {
      console.error('❌ Error fetching categories:', catErr);
      categories = ['Finance', 'Business', 'Investment'];
    }

    // Ensure categories is always an array
    if (!Array.isArray(categories)) {
      console.log('⚠️ Categories is not array, converting...');
      categories = [];
    }

    console.log('📦 About to render with categories:', categories);

    // Render the page with ALL required variables
    res.render('menu', {
      products: products,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      totalProducts: totalProducts,
      categories: categories,
      selectedCategory: category || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || ''
    });

    console.log('✅ Render successful');

  } catch (err) {
    console.error('❌❌❌ Error in getProducts:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).send('Server Error: ' + err.message);
  }
};

console.log('✅ ProductController exports defined');