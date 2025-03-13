const express = require("express");
const router = express.Router();
const progressionController = require("../controllers/progressionController");

// Get user progress
router.get("/:userId", progressionController.getUserProgress);

// Update quiz progress
router.post("/quiz", progressionController.updateQuizProgress);

// Update reading progress
router.post("/reading", progressionController.updateReadingProgress);

module.exports = router;
