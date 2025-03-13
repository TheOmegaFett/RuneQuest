const express = require("express");
const router = express.Router();
const divinationController = require("../controllers/divinationController");

// Get single rune reading
router.get("/single", divinationController.getSingleRuneReading);

// Get three rune spread
router.get("/three", divinationController.getThreeRuneSpread);

// Get five rune spread
router.get("/five", divinationController.getFiveRuneSpread);

// Save reading
router.post("/save", divinationController.saveReading);

// Get user's past readings
router.get("/history/:userId", divinationController.getReadingHistory);

module.exports = router;
