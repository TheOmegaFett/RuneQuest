const express = require("express");
const router = express.Router();

/**
 * Main application router
 * Centralizes all route mounting and API organization
 *
 * Route Structure:
 * - /runes: Rune management endpoints
 * - /categories: Rune category endpoints
 * - /audio: Audio file management endpoints
 * - /search: Search functionality across runes
 * - /users: User management endpoints
 */

// Mount rune-related routes
router.use("/runes", require("./runeRoutes"));

// Mount category-related routes
router.use("/categories", require("./runeCategoryRoutes"));

// Mount audio-related routes
router.use("/audio", require("./audioRoutes"));

// Mount divination-related routes
router.use("/divination", require("./divinationRoutes"));

// Mount reading-related routes
router.use("/readings", require("./readingRoutes"));

// // Add search functionality
// router.use("/search", require("./searchRoutes"));

// // Add user management
// router.use("/users", require("./userRoutes"));

// Add health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

module.exports = router;
