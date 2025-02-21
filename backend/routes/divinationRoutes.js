const express = require("express");
const router = express.Router();

// Get single rune reading
router.post("/single", getSingleRuneReading);

// Get three rune spread
router.post("/three", getThreeRuneSpread);

// Get five rune spread
router.post("/five", getFiveRuneSpread);

// Save reading
router.post("/save", saveReading);

// Get user's past readings
router.get("/history/:userId", getReadingHistory);

module.exports = router;
