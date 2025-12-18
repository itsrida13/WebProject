// backend/data/seedProducts.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

connectDB();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️  Cleared existing products');
    
    const products = [
      { 
        name: "Investment Strategy Guide", 
        price: 5000, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=500&fit=crop", 
        description: "Comprehensive guide to building a diversified investment portfolio with proven strategies." 
      },
      { 
        name: "Business Consultation Package", 
        price: 8000, 
        category: "Business", 
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop", 
        description: "Professional financial advice and business planning consultation from industry experts." 
      },
      { 
        name: "Stock Market Mastery Course", 
        price: 6000, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=500&fit=crop", 
        description: "Master stock trading basics and advanced techniques with real-world examples." 
      },
      { 
        name: "Tax Planning & Optimization", 
        price: 3000, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&h=500&fit=crop", 
        description: "Strategic tax planning services to optimize your financial strategy and reduce liability." 
      },
      { 
        name: "Real Estate Investment Guide", 
        price: 12000, 
        category: "Investment", 
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=500&fit=crop", 
        description: "Complete property investment guidance with market analysis and growth opportunities." 
      },
      { 
        name: "Retirement Planning Service", 
        price: 4500, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=500&fit=crop", 
        description: "Secure your retirement future with comprehensive planning and wealth management." 
      },
      { 
        name: "Cryptocurrency Investment", 
        price: 7500, 
        category: "Investment", 
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500&h=500&fit=crop", 
        description: "Navigate the crypto market with expert guidance on blockchain investments." 
      },
      { 
        name: "Portfolio Management", 
        price: 9000, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop", 
        description: "Professional portfolio management service with regular rebalancing and optimization." 
      },
      { 
        name: "Financial Planning Workshop", 
        price: 3500, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=500&fit=crop", 
        description: "Interactive workshop covering budgeting, saving, and long-term financial goals." 
      },
      { 
        name: "Business Loan Advisory", 
        price: 5500, 
        category: "Business", 
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=500&fit=crop", 
        description: "Expert advice on securing business loans and managing corporate finances." 
      },
      { 
        name: "Wealth Management Plan", 
        price: 10000, 
        category: "Investment", 
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&h=500&fit=crop", 
        description: "Comprehensive wealth management with asset allocation and risk assessment." 
      },
      { 
        name: "Insurance Planning", 
        price: 2500, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?w=500&h=500&fit=crop", 
        description: "Complete insurance planning covering life, health, and asset protection." 
      },
      { 
        name: "Startup Financial Setup", 
        price: 8500, 
        category: "Business", 
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop", 
        description: "End-to-end financial setup for startups including accounting and compliance." 
      },
      { 
        name: "Mutual Funds Advisory", 
        price: 4000, 
        category: "Investment", 
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&h=500&fit=crop", 
        description: "Professional guidance on mutual fund selection and portfolio diversification." 
      },
      { 
        name: "Estate Planning Service", 
        price: 6500, 
        category: "Finance", 
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop", 
        description: "Comprehensive estate planning to protect and transfer your wealth efficiently." 
      }
    ];
    
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully with high-quality images!`);
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding products:', err);
    process.exit(1);
  }
};

seedProducts();