const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const PendingAdmin = require("../models/PendingAdmin");

router.post("/request-admin-signup", async (req, res) => {
  try {
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
    } = req.body;



    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPendingAdmin = new PendingAdmin({
      firstName,
      middleName,
      lastName,
      dob,
      phone,
      gender,
      email,
      password: hashedPassword,
    });

    await newPendingAdmin.save();

    res.json({ message: "Admin signup request submitted. Await admin approval." });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({ message: "Admin registration failed." });
  }
});

module.exports = router;
