const mongoose = require("mongoose");

const pendingAdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PendingAdmin", pendingAdminSchema);
