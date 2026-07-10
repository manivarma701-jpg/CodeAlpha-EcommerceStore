const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// All cart routes require a logged-in user
router.use(protect);

// @route   GET /api/cart
// @desc    Get the current user's saved cart
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/cart
// @desc    Replace the current user's cart with the given items
//          body: { items: [{ product, quantity }] }
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items must be an array' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items });
    } else {
      cart.items = items;
    }
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/cart
// @desc    Empty the cart (called after an order is placed)
router.delete('/', async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { upsert: true });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
