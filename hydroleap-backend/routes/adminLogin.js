const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(403).json({ message: "Admin not found" }); // ✅ NOT "Not an admin"
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        email: admin.email,
        tenantId: admin.tenantId,
      },
    });
  } catch (err) {
    console.error("❌ Admin Login Error:", err.message);
    return res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
