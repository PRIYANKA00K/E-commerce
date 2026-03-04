require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");

require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/priyaecommerce")
  .then(() => console.log("MongoDB Connected"));

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

mongoose.connection.once("open", async () => {
  console.log("Connected to DB:", mongoose.connection.name);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections in this DB:", collections.map(c => c.name));
});

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(adminRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));