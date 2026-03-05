const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");
const noteRoutes = require("./routes/notes");

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api", noteRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});