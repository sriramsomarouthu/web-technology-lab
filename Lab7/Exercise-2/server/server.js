require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const path        = require("path");
const { MongoClient } = require("mongodb");

const booksRouter = require("./routes/books");

const app       = express();
const PORT      = process.env.PORT      || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME   = process.env.DB_NAME   || "book_finder_db";

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// ── Routes ──────────────────────────────────────────────
app.use("/books", booksRouter);

app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date().toISOString() })
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/index.html"))
);

// ── Connect & Start ──────────────────────────────────────
async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log(`✅  MongoDB connected at ${MONGO_URI}`);
    app.locals.db = client.db(DB_NAME);

    app.listen(PORT, () => {
      console.log(`🚀  Server running at http://localhost:${PORT}`);
      console.log(`📚  Books API:         http://localhost:${PORT}/books`);
      console.log(`🌱  To seed data run:  npm run seed`);
    });
  } catch (err) {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();