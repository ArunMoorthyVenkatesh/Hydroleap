const express = require('express');
const router = express.Router();
const Project2 = require('../models/Project2');
const ProjectChangeLog2 = require('../models/ProjectChangeLog2');

// GET a single project2
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project2.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project2 not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE project2 and save change history
router.put('/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const updates = req.body;
  const changedBy = req.user?.email || "system";

  try {
    const project = await Project2.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project2 not found' });

    // Save pre-change snapshot to history
    await ProjectChangeLog2.create({
      projectId: project._id,
      oldData: project.toObject(),
      changedBy
    });

    Object.assign(project, updates);
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
