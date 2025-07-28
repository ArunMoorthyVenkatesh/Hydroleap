// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const PendingUser = require('../models/PendingUser');
const User = require('../models/User');
const PendingAdmin = require('../models/PendingAdmin');
const Admin = require('../models/Admin');

// Signup endpoint for users and admins
router.post('/request-signup', async (req, res) => {
  try {
    // DEBUG: Log everything received from frontend
    console.log("🟡 Received request-signup:", req.body);

    const {
      firstName,
      middleName,
      lastName,
      dob,
      phone,
      gender,
      email,
      password,
      confirmPassword,
      role,
    } = req.body;

    // Validate presence of all fields
    if (
      !firstName || !lastName || !dob || !phone || !gender ||
      !email || !password || !confirmPassword || !role 
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const lowerEmail = email.trim().toLowerCase();

    // Check for existing accounts
    const existsInUsers = await User.findOne({ email: lowerEmail });
    const existsInPendingUsers = await PendingUser.findOne({ email: lowerEmail });
    const existsInAdmins = await Admin.findOne({ email: lowerEmail });
    const existsInPendingAdmins = await PendingAdmin.findOne({ email: lowerEmail });

    if (existsInUsers || existsInPendingUsers || existsInAdmins || existsInPendingAdmins) {
      return res.status(400).json({
        message: 'Email already registered or pending approval as user or admin',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${middleName || ""} ${lastName}`.replace(/\s+/g, " ").trim();

    const commonFields = {
      name: fullName,
      dob,
      phone,
      gender,
      email: lowerEmail,
      password: hashedPassword,
    };

    // Log what is about to be saved
    console.log("🟢 Fields to PendingUser/PendingAdmin:", commonFields);

    if (role === 'admin') {
      const pendingAdmin = new PendingAdmin(commonFields);
      await pendingAdmin.save();
      return res.status(201).json({
        message: 'Admin signup request submitted. Await admin approval.',
      });
    } else {
      const pendingUser = new PendingUser(commonFields);
      await pendingUser.save();
      return res.status(201).json({
        message: 'User signup request submitted. Await admin approval.',
      });
    }
  } catch (err) {
    console.error("Signup error:", err.message, err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
