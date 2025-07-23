const mongoose = require("mongoose");

const iotDataSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  deviceId: { type: String, required: true },
  FIT_01: Number,
  FIT_02: Number,
  LIT_01: Number,
  LIT_02: Number,
  Temperature: Number,
  Pressure: Number,
  "system running": Boolean,
  Pump_01: Boolean,
  Rectifier_01: Boolean
});

module.exports = mongoose.model("IoTData", iotDataSchema);
