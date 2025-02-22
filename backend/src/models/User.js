const mongoose = require("mongoose");

/**
 * Mongoose schema for Users
 * Tracks user information, preferences, and progress in the RuneQuest application
 * @typedef {Object} User
 */
const UserSchema = new mongoose.Schema({
  // Unique username for identification
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // User's email address for communications
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // User customization settings
  preferences: {
    theme: {
      type: String,
      default: "light",
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  // User's learning progress tracking
  progress: {
    // Completed quiz references
    completedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    // Completed puzzle references
    completedPuzzles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Puzzle",
      },
    ],
    // Earned achievement references
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
  },
  // Account creation timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
