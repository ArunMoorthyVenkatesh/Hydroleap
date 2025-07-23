const express = require("express");
const router = express.Router();
const User = require("../models/GeneralUser");

router.put("/assign/:id", async (req, res) => {
  const { role } = req.body;
  const allowedRoles = ["Event Viewer", "Event Manager", "Dashboard User", "Admin"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Role assigned successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating role:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
