const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  spread: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  runes: [
    {
      name: String,
      orientation: String,
      meaning: String,
    },
  ],
  interpretation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reading", ReadingSchema);
