const express = require("express");
const router = express.Router();

// Get all runes
router.get("/", getAllRunes);

// Create new rune
router.post("/", createRune);

// Get rune by ID
router.get("/:id", getRuneById);

// Update rune
router.put("/:id", updateRune);

// Delete rune
router.delete("/:id", deleteRune);

// Get runes by category
router.get("/category/:categoryId", getRunesByCategory);

// Get rune pronunciation
router.get("/:id/pronunciation", getRunePronunciation);

module.exports = router;
