// backend/middleware/discount.js

const applyDiscount = (req, res, next) => {
  // Check for coupon in Query (GET) or Body (POST)
  const couponCode = req.query.coupon || req.body.coupon || '';
  
  res.locals.discountData = {
    code: '',
    rate: 0,
    isValid: false,
    message: ''
  };

  if (couponCode) {
    if (couponCode.toUpperCase() === 'SAVE10') {
      res.locals.discountData = {
        code: 'SAVE10',
        rate: 0.10, // 10%
        isValid: true,
        message: 'Coupon SAVE10 applied! 10% Discount.'
      };
    } else {
        res.locals.discountData = {
        code: couponCode,
        rate: 0,
        isValid: false,
        message: 'Invalid Coupon Code'
      };
    }
  }

  next();
};

module.exports = applyDiscount;
