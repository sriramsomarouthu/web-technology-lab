const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// Helper to get the notes collection
const getCollection = (req) => req.app.locals.db.collection("notes");

/* ─────────────────────────────────────────
   GET /notes  → View all notes
───────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const notes = await getCollection(req)
      .find({})
      .sort({ created_date: -1 })
      .toArray();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes", details: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /notes/:id  → Get a single note
───────────────────────────────────────── */
router.get("/:id", async (req, res) => {
  try {
    const note = await getCollection(req).findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch note", details: err.message });
  }
});

/* ─────────────────────────────────────────
   POST /notes  → Add a new note
   Body: { title, subject, description }
───────────────────────────────────────── */
router.post("/", async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    // Validation
    if (!title || !subject || !description) {
      return res.status(400).json({ error: "title, subject, and description are required" });
    }

    const newNote = {
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      created_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    };

    const result = await getCollection(req).insertOne(newNote);
    res.status(201).json({ message: "Note created", id: result.insertedId, note: newNote });
  } catch (err) {
    res.status(500).json({ error: "Failed to create note", details: err.message });
  }
});

/* ─────────────────────────────────────────
   PUT /notes/:id  → Update a note
   Body: { title?, subject?, description? }
───────────────────────────────────────── */
router.put("/:id", async (req, res) => {
  try {
    const { title, subject, description } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (subject) updates.subject = subject.trim();
    if (description) updates.description = description.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }

    const result = await getCollection(req).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note updated successfully", modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to update note", details: err.message });
  }
});

/* ─────────────────────────────────────────
   DELETE /notes/:id  → Delete a note
───────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const result = await getCollection(req).deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note", details: err.message });
  }
});

module.exports = router;