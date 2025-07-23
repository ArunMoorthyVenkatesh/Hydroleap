const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: String,
});

module.exports = mongoose.model("EventManager", schema);
