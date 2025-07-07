const mongoose = require("mongoose");

const projectEntrySchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true },
    deviceId: { type: String, required: true },
    "system running": { type: Boolean, default: false },
    Pump_01: { type: Boolean, default: false },
    FIT_01: { type: Number, default: 0 },
    Pressure: { type: Number, default: 0 },
    Temperature: { type: Number, default: 0 },
    FIT_02: { type: Number, default: 0 },
    LIT_01: { type: Number, default: 0 },
    LIT_02: { type: Number, default: 0 },
    Rectifier_01: { type: Boolean, default: false },
    Rectifier_V: { type: Number, default: 0 },
    Rectifier_A: { type: Number, default: 0 },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "projects" }
);

module.exports = mongoose.models.ProjectEntry || mongoose.model("ProjectEntry", projectEntrySchema);
