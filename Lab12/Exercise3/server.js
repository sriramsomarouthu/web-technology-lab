const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/students", require("./routes/studentRoutes"));

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});