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
 */

// Mount rune-related routes - handles core rune operations
router.use("/runes", require("./runeRoutes"));

// Mount category-related routes - manages rune classifications
router.use("/categories", require("./runeCategoryRoutes"));

// Mount audio-related routes - handles pronunciation recordings
router.use("/audio", require("./audioRoutes"));

module.exports = router;
