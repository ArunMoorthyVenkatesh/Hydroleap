const mongoose = require("mongoose");

// Define PendingUser schema with all required fields
const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Log schema fields on server startup
console.log("Loaded PendingUser schema fields:", Object.keys(pendingUserSchema.paths));

// Pre-save hook: log full document before writing to DB
pendingUserSchema.pre('save', function(next) {
  console.log('🔵 [Pre-save] PendingUser doc about to be saved:', this);
  next();
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);