const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema(
  {
    rune: {
      type: String,
      required: true,
      trim: true,
    },
    correctMeaning: {
      type: String,
      required: true,
    },
    incorrectMeanings: {
      type: [String],
      validate: [
        arrayLimit,
        "Need at least 3 incorrect answers for hard difficulty",
      ],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    category: {
      type: String,
      enum: ["elder-futhark", "younger-futhark", "anglo-saxon"],
      default: "elder-futhark",
    },
    additionalInfo: String,
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length >= 3;
}

module.exports = mongoose.model("QuizQuestion", QuizQuestionSchema);
