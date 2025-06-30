// controllers/adminLoginController.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.loginAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Generate token
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Admin Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};
