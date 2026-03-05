const express = require("express");
const router = express.Router();
const Note = require("../models/Note");


// Add Note
router.post("/notes", async (req, res) => {
  const { title, subject, description } = req.body;

  const note = new Note({
    title,
    subject,
    description
  });

  const savedNote = await note.save();
  res.json(savedNote);
});


// View Notes
router.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});


// Update Note
router.put("/notes/:id", async (req, res) => {
  const { title, description } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true }
  );

  res.json(updatedNote);
});


// Delete Note
router.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note Deleted" });
});

module.exports = router;