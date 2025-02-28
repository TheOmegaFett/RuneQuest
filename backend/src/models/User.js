const mongoose = require("mongoose");
const crypto = require("node:crypto")

const { encryptPassword } = require("../middleware/encryptPassword")

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
    // User's email address for communications
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // }, REMOVED FOR NOW TO PROTECT USER'S PERSONAL DATA
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
      required: false,
      unique: false,
      default: ""
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
    // // Account creation timestamp
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // }, Used automated built in feature instead.
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Encrypt password
UserSchema.pre("save", encryptPassword);

module.exports = mongoose.model("User", UserSchema);
