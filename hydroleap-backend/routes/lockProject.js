const express = require("express");
const router = express.Router();
const LockedProject = require("../models/LockedProject");

router.post("/lock", async (req, res) => {
  const { projectId } = req.body;

  try {
    const existing = await LockedProject.findOne({ projectId });
    if (existing) return res.status(400).json({ message: "Project already locked." });

    const lock = new LockedProject({ projectId });
    await lock.save();
    res.status(200).json({ message: "Project locked successfully." });
  } catch (error) {
    console.error("Locking error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/unlock", async (req, res) => {
  const { projectId } = req.body;

  try {
    await LockedProject.deleteOne({ projectId });
    res.status(200).json({ message: "Project unlocked successfully." });
  } catch (error) {
    console.error("Unlocking error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/is-locked/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const lock = await LockedProject.findOne({ projectId });
    res.json({ locked: !!lock });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
