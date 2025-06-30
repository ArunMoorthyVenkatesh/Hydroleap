const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const PendingAdmin = require("../models/PendingAdmin");
const Admin = require("../models/Admin");
const PendingUser = require("../models/PendingUser");
const User = require("../models/User");

router.get("/pending-admins", async (req, res) => {
  try {
    const pending = await PendingAdmin.find().collation({ locale: "en", strength: 2 });
    res.status(200).json(pending);
  } catch (err) {
    console.error("❌ Failed to fetch pending admins:", err.message);
    res.status(500).json({ message: "Could not fetch pending admins" });
  }
});

router.post("/approve-admin/:id", async (req, res) => {
  try {
    const pending = await PendingAdmin.findById(req.params.id);
    if (!pending) {
      return res.status(404).json({ message: "Pending admin not found" });
    }

    const hashedPassword = await bcrypt.hash(pending.password, 10);

    const newAdmin = new Admin({
      ...pending._doc,
      email: pending.email.toLowerCase(),
      password: hashedPassword,
      tenantId: "T" + Date.now(),
    });

    await newAdmin.save();
    await PendingAdmin.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Admin approved successfully" });
  } catch (err) {
    console.error("❌ Admin approval error:", err.message);
    res.status(500).json({ message: "Admin approval failed" });
  }
});

router.get("/pending-users", async (req, res) => {
  try {
    const pendingUsers = await PendingUser.find().collation({ locale: "en", strength: 2 });
    res.status(200).json(pendingUsers);
  } catch (err) {
    console.error("❌ Failed to fetch pending users:", err.message);
    res.status(500).json({ message: "Unable to fetch pending users" });
  }
});

router.post("/approve-user/:id", async (req, res) => {
  try {
    const pending = await PendingUser.findById(req.params.id);
    if (!pending) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    const existingUser = await User.findOne({ email: pending.email.toLowerCase() });
    if (existingUser) {
      await PendingUser.findByIdAndDelete(req.params.id);
      return res.status(409).json({ message: "User already exists. Removed from pending." });
    }

    const newUser = new User({
      name: pending.name,
      dob: pending.dob,
      phone: pending.phone,
      gender: pending.gender,
      email: pending.email.toLowerCase(),
      password: pending.password,
    });

    await newUser.save();
    await PendingUser.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User approved and added to active users." });
  } catch (err) {
    console.error("❌ Approve User Error:", err.message);
    res.status(500).json({ message: "User approval failed" });
  }
});

router.get("/list-admins", async (req, res) => {
  try {
    const admins = await Admin.find().collation({ locale: "en", strength: 2 });
    res.status(200).json(admins);
  } catch (err) {
    console.error("❌ Failed to fetch admin list:", err.message);
    res.status(500).json({ message: "Could not fetch admin list" });
  }
});

router.get("/list-users", async (req, res) => {
  try {
    const users = await User.find().collation({ locale: "en", strength: 2 });
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Failed to fetch user list:", err.message);
    res.status(500).json({ message: "Could not fetch user list" });
  }
});

module.exports = router;
