const express = require("express");
const router = express.Router();
const Project = require("../models/Project"); // your actual project model
const { logHistory } = require("../utils/historyLogger");

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE project (log after creation)
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    await logHistory({
      collectionName: "projects",
      documentId: project._id,
      action: "create",
      snapshot: project.toObject(),
      changedBy: req.user ? req.user.email : "system"
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE project (log before update)
router.put("/:id", async (req, res) => {
  try {
    const old = await Project.findById(req.params.id);
    if (!old) return res.status(404).json({ message: "Project not found" });

    await logHistory({
      collectionName: "projects",
      documentId: old._id,
      action: "update",
      snapshot: old.toObject(),
      changedBy: req.user ? req.user.email : "system"
    });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project (log before delete)
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await logHistory({
      collectionName: "projects",
      documentId: project._id,
      action: "delete",
      snapshot: project.toObject(),
      changedBy: req.user ? req.user.email : "system"
    });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
