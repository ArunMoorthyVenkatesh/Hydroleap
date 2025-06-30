const Otp = require("../models/Otp");
const crypto = require("crypto");
const sendOtpEmail = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    await sendOtpEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ OTP Email Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

  await Otp.deleteOne({ _id: validOtp._id });
  res.status(200).json({ message: "OTP verified successfully" });
};
