const Puzzle = require("../models/Puzzle");
const { checkAndUnlockAchievements } = require("../helpers/achievementHelper");

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

exports.completePuzzle = async (req, res) => {
  try {
    const { userId, puzzleId, timeSpent } = req.body;

    if (!userId || !puzzleId) {
      return res.status(400).json({
        success: false,
        error: "Please provide both userId and puzzleId",
      });
    }

    // Find or create user progression
    const UserProgression = require("../models/UserProgression");
    let userProgress = await UserProgression.findOne({ user: userId });

    if (!userProgress) {
      userProgress = new UserProgression({
        user: userId,
        quizzes: [],
        readings: [],
        puzzles: [],
        achievements: [],
        stats: {
          totalPoints: 0,
          quizStreak: 0,
          lastActive: new Date(),
          runesLearned: 0,
        },
      });
    }

    // Add puzzle to progress
    userProgress.puzzles.push({
      puzzle: puzzleId,
      completedAt: new Date(),
      timeSpent: timeSpent || 0,
    });

    // Update stats
    userProgress.stats.lastActive = new Date();
    userProgress.stats.totalPoints += 15; // Award points for puzzle completion

    await userProgress.save();

    // Check for unlocked achievements
    const puzzleData = { timeSpent };
    const newAchievements = await checkAndUnlockAchievements(
      userId,
      puzzleData,
      "puzzle"
    );

    res.status(200).json({
      success: true,
      data: {
        progress: userProgress,
        newAchievements: newAchievements,
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
