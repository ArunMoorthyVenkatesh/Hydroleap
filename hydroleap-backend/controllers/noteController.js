const Note = require("../models/Note");

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({
      title,
      content,
      tenantId: req.user.tenantId,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create note" });
  }
};

module.exports = {
  createNote,
};
