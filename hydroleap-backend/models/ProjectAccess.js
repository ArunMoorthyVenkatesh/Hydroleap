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
    trim: true,
  },
  accessGrantedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure each user can only be assigned to a project once
projectAccessSchema.index({ email: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model("ProjectAccess", projectAccessSchema, "projectaccesses");
