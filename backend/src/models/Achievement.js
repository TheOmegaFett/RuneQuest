const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["quiz", "puzzle", "reading", "general"],
      required: true,
    },
    icon: {
      type: String,
      default: "default-achievement.svg",
    },
    requirement: {
      type: Object,
      required: true,
      // Example: { type: "quiz_completed", count: 10, difficulty: "hard" }
    },
    points: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", AchievementSchema);
