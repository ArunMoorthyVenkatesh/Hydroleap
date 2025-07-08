const express = require("express");
const router = express.Router();
const ProjectAccess = require("../models/ProjectAccess");
const Project = require("../models/Project");

// GET /api/user-projects/:email — Return assigned projects for a user
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    // Find all projectIds this user has access to
    const accessDocs = await ProjectAccess.find({ email });
    const assignedProjectIds = accessDocs.map(a => a.projectId);

    if (assignedProjectIds.length === 0) return res.json({ projects: [] });

    // Fetch all matching projects from the Project collection
    const projects = await Project.find({ projectId: { $in: assignedProjectIds } });

    // If you want to return just IDs:
    // res.json({ projects: projects.map(p => p.projectId) });

    // If you want the full project object:
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user projects", error: err.message });
  }
});

module.exports = router;
