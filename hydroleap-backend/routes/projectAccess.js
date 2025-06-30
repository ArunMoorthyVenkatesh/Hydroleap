const express = require("express");
const router = express.Router();
const ProjectAccess = require("../models/ProjectAccess");
const User = require("../models/User");

// Grant access to a user for a specific project
router.post("/assign", async (req, res) => {
  const { email, projectId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Not a user" });

    const alreadyExists = await ProjectAccess.findOne({ email, projectId });
    if (alreadyExists) return res.status(400).json({ message: "Access already exists" });

    const newAccess = new ProjectAccess({ email, projectId });
    await newAccess.save();

    res.status(200).json({ message: "Access granted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to grant access", error: err.message });
  }
});

// Get all project access for a given user
router.get("/:email", async (req, res) => {
  try {
    const accessList = await ProjectAccess.find({ email: req.params.email });
    res.status(200).json(accessList);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch access", error: err.message });
  }
});

module.exports = router;
