const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: Array,
  totalAmount: Number,
  paymentMode: String,
  status: { type: String, default: "Placed" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);