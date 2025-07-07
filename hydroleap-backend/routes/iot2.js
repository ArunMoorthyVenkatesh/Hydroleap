const express = require("express");
const router = express.Router();
const Project = require("../models/Project"); // Use your correct model file

// ✅ GET IoT data for specific projectId and deviceId
router.get("/:projectId/:deviceId", async (req, res) => {
  const { projectId, deviceId } = req.params;

  try {
    const project = await Project.findOne({ projectId, deviceId });

    if (!project) {
      return res.status(404).json({ message: "Project or Device not found" });
    }

    // Extract sensor data if present -- ADD Pressure & Temperature!
    const data = {
      "system running": project["system running"],
      Pump_01: project.Pump_01,
      FIT_01: project.FIT_01,
      FIT_02: project.FIT_02,
      LIT_01: project.LIT_01,
      LIT_02: project.LIT_02,
      Rectifier_01: project.Rectifier_01,
      Rectifier_V: project.Rectifier_V,
      Rectifier_A: project.Rectifier_A,
      Temperature: project.Temperature,    // <-- ADDED
      Pressure: project.Pressure           // <-- ADDED
    };

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error fetching IoT data:", err.message);
    res.status(500).json({ message: "Server error while retrieving IoT data" });
  }
});

module.exports = router;
