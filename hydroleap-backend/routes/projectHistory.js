// routes/projectHistory_2.js
const express = require("express");
const router = express.Router();
const ProjectHistory = require("../models/ProjectHistory_2");

// GET all history entries for a project
router.get("/:projectId", async (req, res) => {
  try {
    const history = await ProjectHistory.find({ projectId: req.params.projectId }).sort({ changedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
});

module.exports = router;
