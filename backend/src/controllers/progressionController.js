const UserProgression = require("../models/UserProgression");
const Achievement = require("../models/Achievement");

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    let userProgress = await UserProgression.findOne({ user: userId });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: "User progress not found",
      });
    }

    // If we need to populate related data
    if (userProgress.populate) {
      userProgress = await userProgress
        .populate("achievements.achievement")
        .lean();
    }

    return res.status(200).json({
      success: true,
      data: userProgress,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.updateQuizProgress = async (req, res) => {
  try {
    const {
      userId,
      quizId,
      score,
      correctAnswers,
      totalQuestions,
      difficulty,
    } = req.body;

    // Find or create user progression
    let userProgress = await UserProgression.findOne({ user: userId });
    if (!userProgress) {
      userProgress = await UserProgression.create({
        user: userId,
        quizzes: [],
        readings: [],
        achievements: [],
        stats: {
          totalPoints: 0,
          quizStreak: 0,
          lastActive: new Date(),
          runesLearned: 0,
        },
      });
    }

    // Add quiz to progress
    userProgress.quizzes.push({
      quiz: quizId,
      score,
      correctAnswers,
      totalQuestions,
      difficulty,
      completedAt: new Date(),
    });

    // Update stats
    userProgress.stats.lastActive = new Date();
    userProgress.stats.totalPoints += score;

    await userProgress.save();

    return res.status(200).json({
      success: true,
      data: userProgress,
    });
  } catch (error) {
    console.error("Quiz progress update error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.updateReadingProgress = async (req, res) => {
  try {
    const { userId, readingId, isCompleted } = req.body;

    // Find or create user progression
    let userProgress = await UserProgression.findOne({ user: userId });
    if (!userProgress) {
      userProgress = await UserProgression.create({
        user: userId,
        quizzes: [],
        readings: [],
        achievements: [],
        stats: {
          totalPoints: 0,
          quizStreak: 0,
          lastActive: new Date(),
          runesLearned: 0,
        },
      });
    }

    // Check if reading already exists in user's readings
    const existingReadingIndex = userProgress.readings.findIndex(
      (r) => r.reading && r.reading.toString() === readingId
    );

    if (existingReadingIndex >= 0) {
      // Update existing reading
      userProgress.readings[existingReadingIndex].isCompleted = isCompleted;
      if (isCompleted) {
        userProgress.readings[existingReadingIndex].readAt = new Date();
      }
    } else {
      // Add new reading to progress
      userProgress.readings.push({
        reading: readingId,
        savedAt: new Date(),
        readAt: isCompleted ? new Date() : null,
        isCompleted,
      });
    }

    // Update stats
    userProgress.stats.lastActive = new Date();

    await userProgress.save();

    return res.status(200).json({
      success: true,
      data: userProgress,
    });
  } catch (error) {
    console.error("Reading progress update error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
