// backend/middleware/discountMiddleware.js
exports.applyDiscount = (req, res, next) => {
  try {
    // Check for coupon in query params or body
    const couponCode = req.query.coupon || req.body.coupon;
    
    console.log('🎟️ Discount middleware - Coupon code:', couponCode);

    // Get cart items
    let cartItems = [];
    if (req.cookies && req.cookies.cart) {
      try {
        cartItems = JSON.parse(req.cookies.cart);
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Initialize discount info
    req.discountInfo = {
      applied: false,
      code: null,
      discountAmount: 0,
      discountPercentage: 0,
      originalTotal: subtotal,
      finalTotal: subtotal
    };

    // Apply discount if valid coupon
    if (couponCode) {
      const upperCoupon = couponCode.toUpperCase().trim();
      
      if (upperCoupon === 'SAVE10') {
        const discountAmount = Math.round(subtotal * 0.10);
        
        req.discountInfo = {
          applied: true,
          code: upperCoupon,
          discountAmount: discountAmount,
          discountPercentage: 10,
          originalTotal: subtotal,
          finalTotal: subtotal - discountAmount
        };
        
        console.log('✅ Discount applied:', req.discountInfo);
      } else {
        console.log('❌ Invalid coupon code:', upperCoupon);
      }
    }

    next();
  } catch (error) {
    console.error('❌ Discount middleware error:', error);
    next();
  }
};