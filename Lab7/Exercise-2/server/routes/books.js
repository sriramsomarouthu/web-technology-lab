const express = require("express");
const router  = express.Router();

const col = (req) => req.app.locals.db.collection("books");
const PAGE_SIZE = 6;

/* ─────────────────────────────────────────────────────
   GET /books?page=1          → Paginated list of books
───────────────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const skip  = (page - 1) * PAGE_SIZE;
    const total = await col(req).countDocuments();
    const books = await col(req).find({}).skip(skip).limit(PAGE_SIZE).toArray();

    res.json({
      books,
      page,
      totalPages : Math.ceil(total / PAGE_SIZE),
      totalBooks : total,
      hasMore    : skip + books.length < total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books", details: err.message });
  }
});

/* ─────────────────────────────────────────────────────
   GET /books/search?title=javascript   → Search by title
───────────────────────────────────────────────────── */
router.get("/search", async (req, res) => {
  try {
    const { title = "" } = req.query;
    if (!title.trim()) return res.json([]);

    const books = await col(req)
      .find({ title: { $regex: title, $options: "i" } })
      .toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

/* ─────────────────────────────────────────────────────
   GET /books/top        → Top rated books (rating >= 4)
───────────────────────────────────────────────────── */
router.get("/top", async (req, res) => {
  try {
    const books = await col(req)
      .find({ rating: { $gte: 4 } })
      .sort({ rating: -1 })
      .limit(5)
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top books", details: err.message });
  }
});

/* ─────────────────────────────────────────────────────
   GET /books/sort/:field    → Sort by price or rating
   field = "price" | "rating"
───────────────────────────────────────────────────── */
router.get("/sort/:field", async (req, res) => {
  try {
    const field     = req.params.field;
    const validSort = ["price", "rating"];
    if (!validSort.includes(field)) {
      return res.status(400).json({ error: "Sort field must be 'price' or 'rating'" });
    }

    // price → ascending (cheapest first), rating → descending (best first)
    const order = field === "price" ? 1 : -1;
    const books = await col(req).find({}).sort({ [field]: order }).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Sort failed", details: err.message });
  }
});

/* ─────────────────────────────────────────────────────
   GET /books/categories         → List all unique categories
───────────────────────────────────────────────────── */
router.get("/categories", async (req, res) => {
  try {
    const categories = await col(req).distinct("category");
    res.json(categories.sort());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories", details: err.message });
  }
});

/* ─────────────────────────────────────────────────────
   GET /books/category/:name    → Filter by category
───────────────────────────────────────────────────── */
router.get("/category/:name", async (req, res) => {
  try {
    const books = await col(req)
      .find({ category: { $regex: req.params.name, $options: "i" } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Filter failed", details: err.message });
  }
});

module.exports = router;