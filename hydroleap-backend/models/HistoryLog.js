const mongoose = require("mongoose");

const historyLogSchema = new mongoose.Schema({
  collectionName: { type: String, required: true }, // e.g., "projects"
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ["create", "update", "delete"], required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  changedBy: { type: String },
  changedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HistoryLog", historyLogSchema);
