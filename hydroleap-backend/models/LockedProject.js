const mongoose = require("mongoose");

const lockedProjectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  lockedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LockedProject", lockedProjectSchema);
