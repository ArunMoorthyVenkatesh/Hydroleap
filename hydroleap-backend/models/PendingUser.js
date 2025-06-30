const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  name: String,
  dob: String,
  phone: String,
  gender: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
