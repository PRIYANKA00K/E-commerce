const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const router = express.Router();

router.post("/checkout", async (req, res) => {
  const { paymentMode } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  let total = 0;

  const products = cart.items.map(item => {
    let price = item.productId.price;

    if (item.productId.isOnSale) {
      price = price - (price * item.productId.discountPercent / 100);
    }

    total += price * item.quantity;

    return {
      name: item.productId.name,
      quantity: item.quantity,
      price
    };
  });

  await Order.create({
    userId,
    products,
    totalAmount: total,
    paymentMode
  });

  await Cart.deleteOne({ userId });

  res.json({ message: "Order Placed Successfully" });
});

module.exports = router;