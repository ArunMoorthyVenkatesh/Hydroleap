const express = require("express");
const Note = require("../models/Note");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.user.tenantId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      createdBy: req.user.email,
      tenantId: req.user.tenantId,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Note creation error:", err);
    res.status(500).json({ msg: "Failed to create note" });
  }
});

module.exports = router;
