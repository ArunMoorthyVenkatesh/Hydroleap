const mongoose = require("mongoose");

const projectAccessSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  accessGrantedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProjectAccess", projectAccessSchema, "projectaccesses");
