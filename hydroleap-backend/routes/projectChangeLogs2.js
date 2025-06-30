const express = require('express');
const router = express.Router();
const ProjectChangeLog2 = require('../models/ProjectChangeLog2');

// GET change logs for a project2
router.get('/:projectId', async (req, res) => {
  try {
    const logs = await ProjectChangeLog2.find({ projectId: req.params.projectId })
      .sort({ changedAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
