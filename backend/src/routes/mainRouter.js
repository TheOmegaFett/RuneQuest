/**
 * Main API router module
 * Aggregates all route modules and provides central routing configuration
 * @module routes/mainRouter
 */

const express = require("express");
const router = express.Router();

// Import route modules
const runeRoutes = require("./runeRoutes");
const puzzleRoutes = require("./puzzleRoutes");
const quizRoutes = require("./quizRoutes");
const runeCategoryRoutes = require("./runeCategoryRoutes");
const audioRoutes = require("./audioRoutes");
const divinationRoutes = require("./divinationRoutes");
const readingRoutes = require("./readingRoutes");
const userRoutes = require("./userRoutes");

/**
 * Register all application route modules with their respective base paths
 * Each module handles its own sub-routes and middleware
 */
router.use("/runes", runeRoutes);
router.use("/puzzles", puzzleRoutes);
router.use("/quizzes", quizRoutes);
router.use("/categories", runeCategoryRoutes);
router.use("/audio", audioRoutes);
router.use("/divination", divinationRoutes);
router.use("/readings", readingRoutes);
router.use("/users", userRoutes);

/**
 * Health check endpoint
 * Used for monitoring and service health verification
 * @name GET/health
 * @function
 * @memberof module:routes/mainRouter
 * @returns {Object} Status object with health indicator
 */
router.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

module.exports = router;
