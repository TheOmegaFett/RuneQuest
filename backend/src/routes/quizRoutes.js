const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Get quiz by difficulty
router.get("/:difficulty", quizController.getQuizByDifficulty);

// Check answer
router.post("/check", quizController.checkAnswer);

module.exports = router;
