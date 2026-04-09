 const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: String,
  year: Number,
  section: String,
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);