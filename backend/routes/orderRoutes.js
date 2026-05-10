const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const NAME_RE = /^[A-Za-z\s]+$/;
const PHONE_RE = /^[0-9]+$/;
/** Typical street formats: nos., comma, apostrophe, #, dash, slash, parens */
const STREET_RE = /^[a-zA-Z0-9\s,.'#\-\/()]+$/;
const CITY_RE = /^[a-zA-Z\s\-'.]+$/;
const COUNTRY_RE = /^[a-zA-Z\s,\.-]+$/;

function validateShippingAddress(addr) {
  const errors = {};
  const fullName = typeof addr.fullName === 'string' ? addr.fullName.trim() : '';
  if (!fullName) errors.fullName = 'Full name is required';
  else if (!NAME_RE.test(fullName)) errors.fullName = 'Name may only contain letters and spaces';

  const phoneRaw = typeof addr.phone === 'string' ? addr.phone.trim() : '';
  if (!phoneRaw) errors.phone = 'Phone is required';
  else if (!PHONE_RE.test(phoneRaw)) errors.phone = 'Phone must contain only numbers';

  const street = typeof addr.address === 'string' ? addr.address.trim() : '';
  if (!street) errors.address = 'Street address is required';
  else if (/[\r\n]/.test(street)) errors.address = 'Street address must be a single line';
  else if (street.length < 5) errors.address = 'Street address is too short (at least 5 characters)';
  else if (street.length > 180) errors.address = 'Street address is too long';
  else if (!STREET_RE.test(street)) errors.address =
    'Use letters, numbers, spaces, or , . \' # - / ( ) only';

  const city = typeof addr.city === 'string' ? addr.city.trim() : '';
  if (!city) errors.city = 'City is required';
  else if (/[\r\n]/.test(city)) errors.city = 'City must be a single line';
  else if (city.length < 2 || city.length > 80) errors.city = 'City must be 2–80 characters';
  else if (!CITY_RE.test(city))
    errors.city = 'City may only contain letters, spaces, hyphens or apostrophes';

  const postalRaw =
    typeof addr.postalCode === 'string'
      ? addr.postalCode.trim().toUpperCase().replace(/\s+/g, ' ')
      : '';
  if (!postalRaw) errors.postalCode = 'Postal code is required';
  else if (/[\r\n]/.test(postalRaw)) errors.postalCode = 'Postal code must be a single line';
  else if (/[^A-Z0-9\s\-]/.test(postalRaw))
    errors.postalCode = 'Postal code may only contain letters, numbers, spaces or hyphens';
  else if (postalRaw.length > 15) errors.postalCode = 'Postal code is too long';
  else if (postalRaw.replace(/[\s\-]/g, '').length < 3)
    errors.postalCode = 'Postal code must have at least 3 letters or digits';

  const country = typeof addr.country === 'string' ? addr.country.trim() : '';
  if (!country) errors.country = 'Country is required';
  else if (/[\r\n]/.test(country)) errors.country = 'Country must be a single line';
  else if (country.length < 2 || country.length > 80) errors.country = 'Country must be 2–80 characters';
  else if (!COUNTRY_RE.test(country))
    errors.country = 'Country may only contain letters, spaces, commas, hyphens or periods';

  return errors;
}

// POST /api/orders
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, notes } = req.body;

  if (!orderItems || orderItems.length === 0)
    return res.status(400).json({ message: 'No order items' });

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  const shipErrors = validateShippingAddress(shippingAddress);
  if (Object.keys(shipErrors).length)
    return res.status(400).json({ message: 'Invalid shipping details', errors: shipErrors });

  const normalizedShipping = {
    fullName: shippingAddress.fullName.trim(),
    address: String(shippingAddress.address).trim(),
    city: String(shippingAddress.city).trim(),
    postalCode: String(shippingAddress.postalCode).trim().toUpperCase().replace(/\s+/g, ' '),
    country: String(shippingAddress.country).trim(),
    phone: String(shippingAddress.phone).trim(),
  };

  // Decrement stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();
    }
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: normalizedShipping,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    notes
  });

  res.status(201).json(order);
}));

// GET /api/orders/my
router.get('/my', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin)
    return res.status(403).json({ message: 'Access denied' });
  res.json(order);
}));

// PUT /api/orders/:id/pay
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  order.status = 'processing';
  await order.save();
  res.json(order);
}));

// Admin routes
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
}));

router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = req.body.status;
  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.json(order);
}));

module.exports = router;
