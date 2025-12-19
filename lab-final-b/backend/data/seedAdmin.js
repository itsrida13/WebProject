// backend/data/seedAdmin.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

connectDB();

const seedAdmin = async () => {
  try {
    await Admin.deleteMany();
    console.log('🗑️  Cleared existing admins');
    
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@financeexpress.com',
      password: 'admin123', // Will be hashed automatically
      role: 'superadmin'
    });

    console.log(`✅ Admin created successfully!`);
    console.log(`📧 Email: admin@financeexpress.com`);
    console.log(`🔑 Password: admin123`);
    console.log(`👤 Username: admin`);
    
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();