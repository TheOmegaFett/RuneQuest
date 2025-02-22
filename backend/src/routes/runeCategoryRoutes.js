const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/runeCategoryController");

/**
 * Router for handling rune category endpoints
 * Base path: /categories
 * Manages classification and grouping of runes
 */

// POST /categories - Create new rune category
router.post("/", createCategory);

// GET /categories - Retrieve all rune categories
router.get("/", getCategories);

module.exports = router;
