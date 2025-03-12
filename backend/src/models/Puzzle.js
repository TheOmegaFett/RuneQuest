const mongoose = require("mongoose");

const PuzzleSchema = new mongoose.Schema(
  {
    englishWord: {
      type: String,
      required: true,
      trim: true,
    },
    runeEquivalent: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    category: {
      type: String,
      default: "general",
    },
    hints: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Puzzle", PuzzleSchema);
