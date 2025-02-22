const express = require("express");
const router = express.Router();
const { createAudio, getAllAudio } = require("../controllers/audioController");

/**
 * Router for handling audio file endpoints
 * Base path: /audio
 * Manages audio recordings for rune pronunciations
 */

// POST /audio - Create new audio record
router.post("/", createAudio);

// GET /audio - Retrieve all audio files
router.get("/", getAllAudio);

module.exports = router;
