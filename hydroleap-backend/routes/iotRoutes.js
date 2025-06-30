// routes/iotRoutes.js
const express = require("express");
const router = express.Router();
const IotData = require("../models/IotData");

// ✅ Get all unique project IDs
router.get("/projects", async (req, res) => {
  try {
    const projects = await IotData.find().distinct("projectId");
    res.json(projects);
  } catch (err) {
    console.error("❌ Failed to fetch projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
