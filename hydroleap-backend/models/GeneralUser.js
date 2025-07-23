const mongoose = require("mongoose");

const generalUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["Event Viewer", "Event Manager", "Dashboard User", "Admin"],
    default: "Dashboard User",
  },
});

module.exports = mongoose.model("GeneralUser", generalUserSchema);
