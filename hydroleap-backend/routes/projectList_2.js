const express = require("express");
const router = express.Router();
const Project = require("../models/Project_2");

// 🔹 GET all full projects (for AllProjects page)
router.get("/all", async (req, res) => {
  try {
    const projects = await Project.find(); // return all project fields
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
});

// 🔹 GET only all project IDs (optional, for dropdowns, etc.)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}, "projectId");
    const ids = projects.map(p => p.projectId);
    res.json(ids);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project IDs" });
  }
});

// 🔹 GET deviceId by projectId (used by IoTDashboard2)
router.get("/:projectId/device", async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ deviceId: project.deviceId });
  } catch (err) {
    res.status(500).json({ message: "Error fetching deviceId", error: err.message });
  }
});

module.exports = router;
