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

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"));
  .catch(err => console.log("MongoDB Error:", err));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));