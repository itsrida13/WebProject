// backend/server.js
console.log("🚀 Server file loaded");

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const connectDB = require('./config/db');

const app = express();
const PORT = 3001;

// View engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const productAPIRoutes = require('./routes/products');         
const productPageRoutes = require('./routes/productRoutes');   

app.use('/test-products', productAPIRoutes);
app.use('/', productPageRoutes);

// Root route
app.get('/', (req, res) => res.send('✅ Server is running'));

// 404 route
app.use((req, res) => res.status(404).send('❌ Page not found'));

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`📦 Test products API: http://localhost:${PORT}/test-products`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();