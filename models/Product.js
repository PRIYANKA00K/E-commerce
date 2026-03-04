const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,           // NEW
  image: String,
  stock: Number,
  isOnSale: { type: Boolean, default: false },
  discountPercent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);