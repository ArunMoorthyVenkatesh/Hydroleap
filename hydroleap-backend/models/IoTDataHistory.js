const mongoose = require("mongoose");

const iotDataHistorySchema = new mongoose.Schema({
  projectId: String,
  deviceId: String,
  snapshot: Object,
  changedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IoTDataHistory", iotDataHistorySchema);
