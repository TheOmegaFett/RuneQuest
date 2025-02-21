const express = require("express");
const router = express.Router();

// Learning Module Routes
router.use("/runes", require("./runeRoutes"));
router.use("/quizzes", require("./quizRoutes"));

// Puzzle Module Routes
router.use("/puzzles", require("./puzzleRoutes"));

// Divination Module Routes
router.use("/readings", require("./divinationRoutes"));

// User Dashboard Routes
router.use("/users", require("./userRoutes"));
router.use("/progress", require("./progressRoutes"));

module.exports = router;
