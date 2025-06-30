const mongoose = require("mongoose");

const pendingAdminSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
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

module.exports = mongoose.model("PendingAdmin", pendingAdminSchema);
