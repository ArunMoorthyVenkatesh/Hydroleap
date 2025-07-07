const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  "system running": Boolean,
  Pump_01: Boolean,
  FIT_01: Number,
  Pressure: Number,
  Temperature: Number,
  FIT_02: Number,
  LIT_01: Number,
  LIT_02: Number,
  Rectifier_01: Boolean,
  Rectifier_V: Number,
  Rectifier_A: Number,
  locked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// ✅ Prevent model overwrite in dev/hot-reload environments
module.exports = mongoose.models.Project2 || mongoose.model("Project2", projectSchema);
