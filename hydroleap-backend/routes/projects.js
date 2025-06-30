const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");
const ProjectAccess = require("../models/ProjectAccess");

// ✅ Assign access to a user for a specific project
router.post("/assign", async (req, res) => {
  const { email, projectId } = req.body;
  console.log("📨 /assign:", req.body);

  try {
    if (!email || !projectId) {
      return res.status(400).json({ message: "Email and projectId are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log("🔍 Normalized Email:", normalizedEmail);

    // 1. Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found in database" });
    }

    // 2. Check if access already exists
    const existing = await ProjectAccess.findOne({ email: normalizedEmail, projectId });
    if (existing) {
      console.log("⚠️ Already has access");
      return res.status(409).json({ message: "User already has access to this project" });
    }

    // 3. Grant access
    const newAccess = new ProjectAccess({
      email: normalizedEmail,
      projectId,
      accessGrantedAt: new Date(),
    });

    await newAccess.save();
    console.log("✅ Access granted:", newAccess);

    return res.status(200).json({ message: `Access granted to ${normalizedEmail}` });
  } catch (err) {
    console.error("🔥 ERROR /assign:", err.stack);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get users with access to a project
router.get("/project-access/list/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const users = await ProjectAccess.find({ projectId });
    return res.status(200).json(users);
  } catch (err) {
    console.error("❌ Failed to fetch access list:", err.stack);
    return res.status(500).json({ message: "Failed to fetch access list" });
  }
});

// ✅ Revoke access
router.post("/project-access/revoke", async (req, res) => {
  try {
    const { email, projectId } = req.body;
    const result = await ProjectAccess.deleteOne({ email, projectId });

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: "Access revoked successfully" });
    } else {
      return res.status(404).json({ message: "No access found to revoke" });
    }
  } catch (err) {
    console.error("❌ Error revoking access:", err.stack);
    return res.status(500).json({ message: "Failed to revoke access" });
  }
});

// ✅ Get all assigned projects for a user
router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const accessList = await ProjectAccess.find({ email });
    const projectIds = accessList.map(a => a.projectId);
    return res.status(200).json({ projects: projectIds });
  } catch (err) {
    console.error("❌ Error fetching user access:", err.stack);
    return res.status(500).json({ message: "Error fetching user access" });
  }
});

// ✅ Get all available projects
router.get("/all-projects", async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json(projects);
  } catch (err) {
    console.error("❌ Failed to fetch projects:", err.stack);
    return res.status(500).json({ message: "Could not fetch projects" });
  }
});

module.exports = router;
