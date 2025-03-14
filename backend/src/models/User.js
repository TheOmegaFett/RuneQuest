const mongoose = require("mongoose");
const crypto = require("node:crypto")

/**
 * Mongoose schema for Users
 * Tracks user information, preferences, and progress in the RuneQuest application
 * @typedef {Object} User
 */
const UserSchema = new mongoose.Schema(
  {
    // Unique username for identification
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // User password
    password: {
      type: String,
      required: true,
      unique: false,
      minLength: 6,
    },
    // User salt for encryption
    salt: {
      type: String,
      default: "",
    },
    // Declaration of admin rights
    isAdmin: {
      type: Boolean,
      default: false,
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
    }
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
