const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Note", NoteSchema);
