require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

const notesRouter = require("./routes/notes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "student_notes_db";

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../client")));

// ── Routes ──────────────────────────────────────────────────
app.use("/notes", notesRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", database: "Connected", timestamp: new Date().toISOString() });
});

// Fallback → serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ── MongoDB Connection + Start ───────────────────────────────
async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log(`✅ Connected to MongoDB at ${MONGO_URI}`);

    const db = client.db(DB_NAME);
    app.locals.db = db; // Attach db to app for access in routes

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📁 Database: ${DB_NAME}`);
      console.log(`📝 Notes API: http://localhost:${PORT}/notes`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

startServer();