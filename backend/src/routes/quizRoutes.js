const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { checkAuthority } = require("../middleware/checkAuthority");

// Public route - can be accessed without authentication for preview
router.get("/:difficulty", quizController.getQuizByDifficulty);

// Protected route - requires authentication to verify answers and record progress
router.post("/check", checkAuthority, quizController.checkAnswer);

module.exports = router;
