// adminRegisterController.js

const bcrypt = require("bcrypt");
const PendingAdmin = require("../models/PendingAdmin");
const Admin = require("../models/Admin");

// 1. Register a new pending admin
exports.registerPendingAdmin = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, password } = req.body;

    // Check if admin or pending admin already exists
    const existingAdmin = await Admin.findOne({ email });
    const existingPending = await PendingAdmin.findOne({ email });
    if (existingAdmin || existingPending) {
      return res.status(400).json({ message: "Admin with this email already exists or is pending." });
    }

    const newPending = new PendingAdmin({ name, email, phone, dob, gender, password });
    await newPending.save();

    res.status(201).json({ message: "Admin registration pending approval." });
  } catch (err) {
    console.error("Register Pending Admin Error:", err);
    res.status(500).json({ message: "Failed to register pending admin." });
  }
};

// 2. Approve a pending admin
exports.approvePendingAdmin = async (req, res) => {
  try {
    const { id } = req.params; // pending admin _id

    const pending = await PendingAdmin.findById(id);
    if (!pending) {
      return res.status(404).json({ message: "Pending admin not found." });
    }

    const hashedPassword = await bcrypt.hash(pending.password, 10);

    // Remove _id and password, then reconstruct object
    const { _id, password, ...rest } = pending._doc;

    const newAdmin = new Admin({
      ...rest,
      password: hashedPassword,
      tenantId: "T" + Date.now(),
    });

    await newAdmin.save();
    await PendingAdmin.findByIdAndDelete(id);

    res.status(200).json({ message: "Admin approved and created successfully." });
  } catch (err) {
    console.error("Approve Pending Admin Error:", err);
    res.status(500).json({ message: "Failed to approve admin." });
  }
};

// 3. Reject a pending admin
exports.rejectPendingAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await PendingAdmin.findById(id);
    if (!pending) {
      return res.status(404).json({ message: "Pending admin not found." });
    }

    await PendingAdmin.findByIdAndDelete(id);

    res.status(200).json({ message: "Pending admin rejected and deleted." });
  } catch (err) {
    console.error("Reject Pending Admin Error:", err);
    res.status(500).json({ message: "Failed to reject admin." });
  }
};

// 4. Get all pending admins (for dashboard)
exports.getAllPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await PendingAdmin.find();
    res.status(200).json(pendingAdmins);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending admins." });
  }
};
