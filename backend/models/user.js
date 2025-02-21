const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  preferences: {
    theme: { type: String, default: "light" },
    notifications: { type: Boolean, default: true },
  },
  progress: {
    completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    completedPuzzles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Puzzle" }],
    achievements: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Achievement" },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
