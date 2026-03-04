const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.post("/admin/add-product", async (req,res)=>{
  await Product.create(req.body);
  res.json({message:"Product Added"});
});

module.exports = router;
