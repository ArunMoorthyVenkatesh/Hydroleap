const express = require("express");
const router = express.Router();
const PendingAdmin = require("../models/PendingAdmin");
const Admin = require("../models/Admin");
const { appendApprovedEmail } = require("../utils/csvAdminCheck");

router.post("/handle-admin-request", async (req, res) => {
  const { id, action } = req.body;

  try {
    const pendingAdmin = await PendingAdmin.findById(id);
    if (!pendingAdmin) return res.status(404).json({ message: "Admin not found" });

    if (action === "approve") {
      const tenantId = "T" + Date.now();

      const newAdmin = new Admin({
        ...pendingAdmin._doc,
        tenantId,
        createdAt: new Date(),
      });

      await newAdmin.save();
      await PendingAdmin.findByIdAndDelete(id);

      appendApprovedEmail(pendingAdmin.email); 

      return res.status(200).json({ message: "Admin approved and added to main admin collection." });
    } else if (action === "reject") {
      await PendingAdmin.findByIdAndDelete(id);
      return res.status(200).json({ message: "Admin rejected and removed from pending list." });
    }

    res.status(400).json({ message: "Invalid action." });
  } catch (err) {
    console.error("❌ Admin approval error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
