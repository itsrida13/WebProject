const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3001;

// EJS setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files (CSS, images)
app.use(express.static('public'));

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Root route - Redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page (no layout - standalone page)
app.get('/login', (req, res) => {
  res.render('login', { layout: false }); // Render without main layout
});

// ============================================
// MAIN WEBSITE ROUTES (After Login)
// ============================================

// Home page (after login)
app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/gallery', (req, res) => {
  res.render('gallery');
});

app.get('/thankyou', (req, res) => {
  res.render('thankyou');
});

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});