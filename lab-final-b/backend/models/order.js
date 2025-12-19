// backend/models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  discountCode: {
    type: String,
    default: null
  },
  grandTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Placed', 'Processing', 'Delivered'],
    default: 'Placed'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['Placed', 'Processing', 'Delivered']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// ✅ CRITICAL: Generate orderNumber BEFORE validation
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
      console.log('📝 Generated order number:', this.orderNumber);
    } catch (error) {
      console.error('❌ Error generating order number:', error);
      return next(error);
    }
  }
  
  // Initialize status history if new order
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory = [{ 
      status: this.status, 
      timestamp: new Date() 
    }];
  }
  
  next();
});

module.exports = mongoose.model('Order', orderSchema); 
