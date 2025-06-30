const Otp = require("../models/Otp");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const PendingAdmin = require("../models/PendingAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔹 Handle registration request for both users and admins
async function requestSignup(req, res) {
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
      role,
    } = req.body;

    if (
      !firstName || !lastName || !dob || !phone || !gender ||
      !email || !password || !confirmPassword || !role
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${middleName || ""} ${lastName}`.replace(/\s+/g, " ").trim();

    if (role === "admin") {
      const existingPendingAdmin = await PendingAdmin.findOne({ email });
      const existingAdmin = await User.findOne({ email }); // Assuming admins also stored in User
      if (existingPendingAdmin || existingAdmin) {
        return res.status(400).json({ message: "Admin email already used or pending approval" });
      }

      const pendingAdmin = new PendingAdmin({
        firstName,
        middleName,
        lastName,
        dob,
        phone,
        gender,
        email,
        password: hashedPassword,
      });

      await pendingAdmin.save();
      return res.status(201).json({ message: "Admin signup request submitted. Awaiting approval." });

    } else {
      const existingPendingUser = await PendingUser.findOne({ email });
      const existingUser = await User.findOne({ email });

      if (existingPendingUser || existingUser) {
        return res.status(400).json({ message: "User email already used or pending approval" });
      }

      const pendingUser = new PendingUser({
        name,
        dob,
        phone,
        gender,
        email,
        password: hashedPassword,
      });

      await pendingUser.save();
      return res.status(201).json({ message: "User signup request submitted. Awaiting approval." });
    }

  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ message: "Signup failed" });
  }
}

// 🔹 User login (only for approved users in User collection)
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found or not approved yet." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      email: user.email,
    });

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
}

// 🔹 Manual approval logic for user
async function approveUserManually(req, res) {
  try {
    const { email } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res.status(404).json({ message: "Pending user not found" });
    }

    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      await PendingUser.deleteOne({ email });
      return res.status(409).json({ message: "User already exists. Removed from pending." });
    }

    const newUser = new User({
      name: pending.name,
      dob: pending.dob,
      phone: pending.phone,
      gender: pending.gender,
      email: pending.email,
      password: pending.password, // ✅ already hashed
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    console.log(`✅ Approved user: ${email} and removed from pending list.`);
    res.status(200).json({ message: "User approved and moved to active users." });

  } catch (err) {
    console.error("❌ Approve User Error:", err.message);
    res.status(500).json({ message: "Approval failed" });
  }
}

module.exports = {
  requestSignup,
  loginUser,
  approveUserManually,
};
