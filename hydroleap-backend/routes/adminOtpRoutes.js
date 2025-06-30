const express = require("express");
const router = express.Router();
const AdminOtp = require("../models/AdminOtp");
const sendEmail = require("../utils/sendEmail");
const { isEmailApproved } = require("../utils/csvAdminCheck");
const crypto = require("crypto");

router.post("/send", async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const email = rawEmail.toLowerCase();

    console.log("🔍 Email received:", email);

    if (!isEmailApproved(email)) {
      console.warn("❌ Email not in approved_admins.csv:", email);
      return res.status(403).json({ message: "This email is not authorized as an admin" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await AdminOtp.deleteMany({ email });
    await AdminOtp.create({ email, otp });

    await sendEmail({
      to: email,
      subject: "Your Admin OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log("✅ OTP sent to:", email);
    res.status(200).json({ message: "OTP sent to your admin email." });
  } catch (error) {
    console.error("❌ OTP send error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

module.exports = router;
