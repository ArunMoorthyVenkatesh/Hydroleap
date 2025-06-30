const express = require("express");
const router = express.Router();
const PendingUser = require("../models/PendingUser");
const User = require("../models/User");

router.post("/handle-user-request", async (req, res) => {
  const { id, action } = req.body;

  try {
    const pendingUser = await PendingUser.findById(id);
    if (!pendingUser) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    if (action === "approve") {
      const newUser = new User({
        name: pendingUser.name,
        dob: pendingUser.dob,
        phone: pendingUser.phone,
        gender: pendingUser.gender,
        email: pendingUser.email,
        password: pendingUser.password,
        createdAt: new Date(),
      });

      await newUser.save();
      await PendingUser.findByIdAndDelete(id);

      return res.status(200).json({ message: "User approved and added to main users collection." });
    } else if (action === "reject") {
      await PendingUser.findByIdAndDelete(id);
      return res.status(200).json({ message: "User rejected and removed from pending list." });
    }

    res.status(400).json({ message: "Invalid action." });
  } catch (error) {
    console.error("Error processing user request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
