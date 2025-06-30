const mongoose = require('mongoose');

const IOTDATA = new mongoose.Schema({
  projectId: String,
  deviceId: String,
  "system running": Boolean,
  Pump_01: Boolean,
  Rectifier_01: Boolean,
  FIT_01: Number,
  FIT_02: Number,
  LIT_01: Number,
  LIT_02: Number,
  Rectifier_V: Number,
  Rectifier_A: Number,
  Temperature: Number,
  Pressure: Number
}, { timestamps: true });

module.exports = mongoose.models.IOTDATA || mongoose.model('IOTDATA', projectSchema);
