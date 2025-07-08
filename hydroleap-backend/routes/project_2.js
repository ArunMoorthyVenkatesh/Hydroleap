// routes/projects.js

const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
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

// GET all projects assigned to a user (by email)
// -- TEMP: Returns all projects. Replace logic if you add assignedUsers field!
router.get("/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    // If you add 'assignedUsers: [String]' in your model, use:
    // const projects = await Project.find({ assignedUsers: email });
    // Otherwise, TEMP: return all projects for now
    const projects = await Project.find();
    res.json({ projects: projects.map(p => p.projectId) });
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
