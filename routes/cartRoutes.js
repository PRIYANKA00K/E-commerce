const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

router.post("/add-to-cart", ensureAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    // ✅ If no cart exists, create a new one
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // ✅ Use .equals() to compare ObjectIds
    const existingItem = cart.items.find(i => i.productId.equals(productId));

    if (existingItem) {
      existingItem.quantity++; // Increment quantity
    } else {
      // Always push ObjectId, not string
      cart.items.push({ productId: mongoose.Types.ObjectId(productId), quantity: 1 });
    }

    await cart.save(); // Save changes

    // Populate product info for response (optional)
    await cart.populate("items.productId");

    res.json({
      message: "Cart updated",
      items: cart.items.map(i => ({
        productId: i.productId._id,
        productName: i.productId.name,
        quantity: i.quantity
      }))
    });
  } catch (err) {
    console.error("Cart update failed:", err);
    res.status(500).json({ message: "Cart update failed" });
  }
});

module.exports = router;