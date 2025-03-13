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

    if (req.userId !== userId) {
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      if (!user || !user.isAdmin) {
        return res.status(403).json({
          success: false,
          error: "You are unauthorized to access this user's progression data",
        });
      }
    }

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

    // Increment quiz streak if the quiz was completed within 24 hours of the last activity
    const lastQuiz = userProgress.quizzes[userProgress.quizzes.length - 2];
    if (lastQuiz) {
      const lastQuizTime = new Date(lastQuiz.completedAt).getTime();
      const currentTime = new Date().getTime();
      const hoursBetween = (currentTime - lastQuizTime) / (1000 * 60 * 60);

      if (hoursBetween < 24) {
        userProgress.stats.quizStreak += 1;
      } else {
        userProgress.stats.quizStreak = 1; // Reset streak if more than 24 hours
      }
    } else {
      userProgress.stats.quizStreak = 1; // First quiz sets streak to 1
    }

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
