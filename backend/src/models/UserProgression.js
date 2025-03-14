const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserProgressionSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    achievements: [
      {
        achievement: {
          type: Schema.Types.ObjectId,
          ref: "Achievement",
        },
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    quizzes: [
      {
        quiz: {
          type: Schema.Types.ObjectId,
          ref: "QuizQuestion",
        },
        score: Number,
        correctAnswers: Number,
        totalQuestions: Number,
        difficulty: String,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    puzzles: [
      {
        puzzle: {
          type: Schema.Types.ObjectId,
          ref: "Puzzle",
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        timeSpent: Number, // in seconds
      },
    ],
    readings: [
      {
        reading: {
          type: Schema.Types.ObjectId,
          ref: "Reading",
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
        readAt: Date,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    stats: {
      totalPoints: {
        type: Number,
        default: 0,
      },
      quizStreak: {
        type: Number,
        default: 0,
      },
      loginStreak: {
        type: Number,
        default: 0,
      },
      lastActive: {
        type: Date,
        default: Date.now,
      },
      runesLearned: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure one progression record per user
UserProgressionSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("UserProgression", UserProgressionSchema);
