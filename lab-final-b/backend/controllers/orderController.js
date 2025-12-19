// backend/controllers/orderController.js
const Order = require('../models/order');
const Product = require('../models/Product');

// GET /order/preview - Show order preview page
exports.showOrderPreview = async (req, res) => {
  try {
    let cartItems = [];
    if (req.cookies && req.cookies.cart) {
      try {
        cartItems = JSON.parse(req.cookies.cart);
      } catch (e) {
        console.error("Error parsing cart cookie", e);
        cartItems = [];
      }
    }

    // If cart is empty, redirect to cart page
    if (cartItems.length === 0) {
      console.log('⚠️ Cart is empty, redirecting to /cart');
      return res.redirect('/cart');
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    console.log('📦 Order Preview:', {
      itemCount: cartItems.length,
      subtotal,
      discount: req.discountInfo ? req.discountInfo.discountAmount : 0
    });

    res.render('order-preview', {
      layout: 'layouts/main',
      cartItems,
      subtotal,
      discount: req.discountInfo ? req.discountInfo.discountAmount : 0,
      discountCode: req.discountInfo ? req.discountInfo.code : null,
      grandTotal: req.discountInfo ? req.discountInfo.finalTotal : subtotal
    });

  } catch (error) {
    console.error('❌ Preview error:', error);
    res.status(500).send('Error loading order preview: ' + error.message);
  }
};

// POST /order/confirm - Create order in MongoDB
exports.confirmOrder = async (req, res) => {
  try {
    console.log('📝 Order confirmation request body:', req.body);

    // Support both old (customerEmail/customerName) and new (billing) formats
    const {
      customerEmail,
      customerName,
      billing,
      items,
      paymentMethod,
      subtotal,
      tax,
      total
    } = req.body;

    const email =
      customerEmail ||
      (billing && billing.email && billing.email.trim());

    const name =
      customerName ||
      (billing &&
        `${billing.firstName || ''} ${billing.lastName || ''}`.trim());

    if (!email || !name) {
      console.log('❌ Missing customer details');
      return res
        .status(400)
        .json({ message: 'Please provide customer name and email' });
    }

    // Prefer cart from request body (checkout), fall back to cookie
    let cartItems = [];
    if (Array.isArray(items) && items.length > 0) {
      cartItems = items;
    } else if (req.cookies && req.cookies.cart) {
      try {
        cartItems = JSON.parse(req.cookies.cart);
      } catch (e) {
        console.error('Error parsing cart:', e);
        cartItems = [];
      }
    }

    if (cartItems.length === 0) {
      console.log('❌ Cart is empty');
      return res
        .status(400)
        .json({ message: 'Your cart is empty' });
    }

    // Calculate totals (use client totals if provided, otherwise compute)
    const computedSubtotal = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const discountInfo = req.discountInfo || {};
    const discountAmount = discountInfo.discountAmount || 0;
    const discountCode = discountInfo.code || null;

    const finalSubtotal =
      typeof subtotal === 'number' ? subtotal : computedSubtotal;

    const finalTax =
      typeof tax === 'number' ? tax : finalSubtotal * 0.05;

    const finalGrandTotal =
      typeof total === 'number'
        ? total
        : finalSubtotal - discountAmount + finalTax;

    console.log('💰 Order totals:', {
      subtotal: finalSubtotal,
      discount: discountAmount,
      tax: finalTax,
      grandTotal: finalGrandTotal,
      itemsCount: cartItems.length
    });

    // ✅ Create order in MongoDB
    const orderData = {
      customerEmail: email.toLowerCase().trim(),
      customerName: name.trim(),
      // extra billing info if present
      customerPhone: billing?.phone || null,
      billingAddress: billing
        ? {
            address: billing.address,
            city: billing.city,
            postalCode: billing.postal,
            country: billing.country
          }
        : undefined,
      paymentMethod: paymentMethod || 'card',
      items: cartItems.map(item => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: finalSubtotal,
      discount: discountAmount,
      discountCode,
      tax: finalTax,
      grandTotal: finalGrandTotal,
      status: 'Placed'
    };

    console.log('💾 Saving order to MongoDB...');
    const order = await Order.create(orderData);

    console.log('✅ Order created successfully!');
    console.log('📦 Order Number:', order.orderNumber);
    console.log('🆔 Order ID:', order._id);

    // Clear cookies after successful order
    res.clearCookie('cart');
    res.clearCookie('discount');

    // For fetch() on checkout page, respond with JSON instead of redirect
    return res.json({
      message: 'Order created successfully',
      orderId: order._id,
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('❌ Order confirmation error:', error);
    console.error('Error stack:', error.stack);
    res
      .status(500)
      .json({ message: 'Error creating order: ' + error.message });
  }
};

// GET /order/success
exports.orderSuccess = async (req, res) => {
  try {
    const { orderId } = req.query;

    console.log('🎉 Success page requested for orderId:', orderId);

    if (!orderId) {
      console.log('⚠️ No orderId provided, redirecting to menu');
      return res.redirect('/menu');
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log('❌ Order not found:', orderId);
      return res.status(404).send('Order not found');
    }

    console.log('✅ Displaying success page for order:', order.orderNumber);

    res.render('order-success', {
      layout: 'layouts/main',
      order
    });

  } catch (error) {
    console.error('❌ Success page error:', error);
    res.status(500).send('Error loading success page: ' + error.message);
  }
};

// GET /order/my-orders (initial page)
exports.showMyOrders = (req, res) => {
  res.render('my-orders', {
    layout: 'layouts/main',
    orders: null,
    email: '',
    error: null
  });
};

// POST /order/my-orders - Fetch orders by email
exports.getMyOrders = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.render('my-orders', {
        layout: 'layouts/main',
        orders: null,
        email: '',
        error: 'Please enter an email address'
      });
    }

    const orders = await Order.find({ customerEmail: email.toLowerCase().trim() })
      .sort({ createdAt: -1 });

    console.log(`📧 Found ${orders.length} orders for email: ${email}`);

    res.render('my-orders', {
      layout: 'layouts/main',
      orders,
      email,
      error: orders.length === 0 ? 'No orders found for this email' : null
    });

  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.render('my-orders', {
      layout: 'layouts/main',
      orders: null,
      email: req.body.email || '',
      error: 'Error fetching orders'
    });
  }
};
