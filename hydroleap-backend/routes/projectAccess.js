const express = require("express");
const router = express.Router();
const ProjectAccess = require("../models/ProjectAccess");
const User = require("../models/User");

// Grant access to a user for a specific project
router.post("/assign", async (req, res) => {
  const { email, projectId } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Not a user" });

    const alreadyExists = await ProjectAccess.findOne({ email: email.toLowerCase(), projectId });
    if (alreadyExists) return res.status(400).json({ message: "Access already exists" });

    const newAccess = new ProjectAccess({ email: email.toLowerCase(), projectId });
    await newAccess.save();

    res.status(200).json({ message: "Access granted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to grant access", error: err.message });
  }
});

// List all users with access to a specific project (CASE-INSENSITIVE)
router.get("/list/:projectId", async (req, res) => {
  try {
    const list = await ProjectAccess.find({
      projectId: { $regex: `^${req.params.projectId}$`, $options: "i" }
    });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch access", error: err.message });
  }
});

// List all projects a user has access to
router.get("/user/:email", async (req, res) => {
  try {
    const list = await ProjectAccess.find({ email: req.params.email.toLowerCase() });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch access", error: err.message });
  }
});

// Revoke access
router.post("/revoke", async (req, res) => {
  const { email, projectId } = req.body;
  try {
    const deleted = await ProjectAccess.findOneAndDelete({ email: email.toLowerCase(), projectId });
    if (!deleted) return res.status(404).json({ message: "Access not found" });
    res.status(200).json({ message: "Access revoked" });
  } catch (err) {
    res.status(500).json({ message: "Failed to revoke access", error: err.message });
  }
});

module.exports = router;
