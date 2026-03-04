const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const passport = require("passport");

const router = express.Router();

/* EMAIL OTP */
router.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email });

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "Priya E-Commerce OTP",
    text: `Your OTP is ${otp}`
  });

  res.json({ message: "OTP sent to email" });
});

/* VERIFY EMAIL OTP */
router.post("/verify-email-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  await user.save();

  req.login(user, (err) => {
    if (err) return res.status(500).json({ message: "Login failed" });
    res.json({ message: "Login success" });
  });
});

/* GOOGLE AUTH */
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/home.html",
    failureRedirect: "/login.html"
  })
);

module.exports = router;