const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// GET all projects
router.get("/all", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
});

// GET deviceId for a specific projectId
router.get("/:projectId/device", async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ deviceId: project.deviceId });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving device ID", error: err.message });
  }
});

module.exports = router;
