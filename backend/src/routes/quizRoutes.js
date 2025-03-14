const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { checkAuthority } = require("../middleware/checkAuthority");

// Public route - can be accessed without authentication for preview
router.get("/:difficulty", quizController.getQuizByDifficulty);

// Protected routes - require authentication
router.post("/check", checkAuthority, quizController.checkAnswer);
router.post("/complete", checkAuthority, quizController.completeQuiz);
module.exports = router;
