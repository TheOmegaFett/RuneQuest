const mongoose = require("mongoose");

const RuneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  meaning: { type: String, required: true },
  symbol: { type: String, required: true },
  pronunciation: { type: String },
  history: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "RuneCategory" },
  audioId: { type: mongoose.Schema.Types.ObjectId, ref: "Audio" },
});

module.exports = mongoose.model("Rune", RuneSchema);
