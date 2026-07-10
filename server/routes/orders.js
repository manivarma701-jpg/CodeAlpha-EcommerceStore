const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route   POST /api/orders
// @desc    Place a new order from the given cart items + shipping address
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an order with an empty cart' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Re-fetch products server-side so prices/stock are trusted, not taken from the client
    const orderItems = [];
    let itemsTotal = 0;

    for (const line of items) {
      const product = await Product.findById(line.productId || line.product);
      if (!product) continue;
      if (product.stock < line.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: line.quantity
      });
      itemsTotal += product.price * line.quantity;
      product.stock -= line.quantity;
      await product.save();
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'None of the items in the cart are available' });
    }

    const shippingFee = itemsTotal >= 500 ? 0 : 49;
    const totalAmount = itemsTotal + shippingFee;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingFee,
      totalAmount
    });

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { upsert: true });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/orders
// @desc    Get the current user's order history
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Invalid order id' });
  }
});

module.exports = router;
