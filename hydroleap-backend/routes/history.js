const express = require("express");
const router = express.Router();
const Project = require("../models/Project"); // or require your Project_2 model if that's what you use
const HistoryLog = require("../models/HistoryLog");

// Fetch logs for a project by projectId (your business ID, e.g., E0011_SG)
router.get("/byProjectId/:projectId", async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const logs = await HistoryLog.find({
      collectionName: "projects",
      documentId: project._id
    }).sort({ changedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Existing route: fetch logs for any collection/documentId
router.get("/:collectionName/:documentId", async (req, res) => {
  try {
    const logs = await HistoryLog.find({
      collectionName: req.params.collectionName,
      documentId: req.params.documentId
    }).sort({ changedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
