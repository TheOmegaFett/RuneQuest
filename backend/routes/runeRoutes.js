const express = require("express");
const router = express.Router();
const {
  getAllRunes,
  addRune,
  deleteRune,
} = require("../controllers/runeController");

/**
 * Router for handling rune-related endpoints
 * Base path: /runes
 * Manages CRUD operations for runes including their relationships and categories
 */

// GET /runes - Retrieve all runes with populated relationships
router.get("/", getAllRunes);

// POST /runes/add - Create a new rune with full details
router.post("/add", addRune);

// DELETE /runes/:id - Remove specific rune and its relationships
router.delete("/:id", deleteRune);
module.exports = router;
