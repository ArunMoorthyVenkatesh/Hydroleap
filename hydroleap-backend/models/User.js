const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  phone: String,
  gender: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 👇 Replace "users" with the exact collection name from your database if different
module.exports = mongoose.model("User", userSchema, "users");
