const express = require("express");
const router = express.Router();
const { verifyAdminToken } = require("../middleware/auth");
const Admin = require("../models/Admin");

// GET /api/admin/profile
router.get("/profile", verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    res.json(admin);
  } catch (err) {
    console.error("Admin profile error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
