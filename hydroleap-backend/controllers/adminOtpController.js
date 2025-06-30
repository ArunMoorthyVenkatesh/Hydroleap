const Otp = require("../models/Otp");
const Admin = require("../models/Admin");
const allowedAdmins = require("../config/adminEmails");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  email = email.toLowerCase(); 

  const adminInDb = await Admin.findOne({ email });

  if (!adminInDb && !allowedAdmins.includes(email)) {
    return res.status(403).json({ message: "This email is not authorized as an admin" });
  }

  try {
    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.deleteMany({ email }); 
    await Otp.create({ email, otp });

    await sendEmail(
      email,
      "Hydroleap Admin Login OTP",
      `Dear Admin,\n\nYour One-Time Password (OTP) for login is: ${otp}\n\nThis code will expire in 5 minutes.`
    );

    console.log("✅ OTP sent to:", email);
    res.status(200).json({ message: "Admin OTP sent to email" });
  } catch (err) {
    console.error("❌ Admin OTP Send Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const match = await Otp.findOne({ email: email.toLowerCase(), otp });

    if (!match) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ _id: match._id }); 
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ Admin OTP Verify Error:", err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
