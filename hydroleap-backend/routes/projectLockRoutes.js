const express = require("express");
const router = express.Router();
const LockList = require("../models/LockList"); // ⬅️ you must have this model
const { protectAdmin } = require("../middleware/authMiddleware");

router.post("/:projectId/lock", protectAdmin, async (req, res) => {
  const { projectId } = req.params;
  try {
    const exists = await LockList.findOne({ projectId });
    if (exists) {
      return res.status(400).json({ message: "Project is already locked." });
    }

    const newLock = new LockList({ projectId });
    await newLock.save();

    res.status(200).json({ message: "Project locked." });
  } catch (err) {
    console.error("❌ Lock error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
