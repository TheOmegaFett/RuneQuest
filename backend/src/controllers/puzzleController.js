const Puzzle = require("../models/Puzzle");

exports.getPuzzles = async (req, res) => {
  try {
    // Support filtering by difficulty/category
    const filters = {};
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;
    if (req.query.category) filters.category = req.query.category;

    const puzzles = await Puzzle.find(filters);

    res.status(200).json({
      success: true,
      count: puzzles.length,
      data: puzzles,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.checkPuzzleAnswer = async (req, res) => {
  try {
    const { puzzleId, userAnswer } = req.body;

    if (!puzzleId || !userAnswer) {
      return res.status(400).json({
        success: false,
        error: "Please provide both puzzleId and userAnswer",
      });
    }

    const puzzle = await Puzzle.findById(puzzleId);

    if (!puzzle) {
      return res.status(404).json({
        success: false,
        error: "Puzzle not found",
      });
    }

    // Check if user answer matches
    const isCorrect =
      userAnswer.trim().toLowerCase() ===
      puzzle.englishWord.trim().toLowerCase();

    // Track user completion if needed
    if (isCorrect && req.user) {
      // Could update user progress here
    }

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: isCorrect ? null : puzzle.englishWord,
        // Only send correct answer if wrong
        message: isCorrect
          ? "Correct! Well done."
          : "Not quite right. Try again!",
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Additional CRUD methods for admin puzzle management
