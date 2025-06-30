const mongoose = require("mongoose");

const AdminOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

module.exports = mongoose.model("AdminOtp", AdminOtpSchema);
