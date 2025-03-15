const Achievement = require("../models/Achievement");
const UserProgression = require("../models/UserProgression");

/**
 * Checks if a user has unlocked any new achievements and updates their progression
 * @param {String} userId - The user's ID
 * @param {Object} activityData - Data about the completed activity
 * @param {String} activityType - Type of activity ('quiz', 'puzzle', 'reading')
 * @returns {Array} - Newly unlocked achievements
 */
exports.checkAndUnlockAchievements = async (
  userId,
  activityData,
  activityType
) => {
  try {
    // Get user progression and all achievements
    const userProgress = await UserProgression.findOne({ user: userId });
    if (!userProgress) return [];

    const allAchievements = await Achievement.find();

    // Get IDs of already unlocked achievements
    const unlockedAchievementIds = userProgress.achievements.map((a) =>
      a.achievement.toString()
    );

    const newlyUnlocked = [];

    // Check each achievement to see if it should be unlocked
    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (unlockedAchievementIds.includes(achievement._id.toString())) {
        continue;
      }

      const requirement = achievement.requirement;
      let isUnlocked = false;

      // Check achievement requirements based on type
      switch (requirement.type) {
        case "quiz_completed":
          if (activityType === "quiz") {
            const quizCount = userProgress.quizzes.length + 1;

            // Basic completion count check
            if (requirement.count && quizCount >= requirement.count) {
              // If difficulty specified, filter by that difficulty
              if (requirement.difficulty) {
                const difficultQuizzes = userProgress.quizzes.filter(
                  (q) => q.difficulty === requirement.difficulty
                );

                // If perfect score required, check that too
                if (requirement.perfectScore) {
                  const perfectScores = difficultQuizzes.filter(
                    (q) => q.correctAnswers === q.totalQuestions
                  );
                  isUnlocked = perfectScores.length >= requirement.count;
                } else {
                  isUnlocked = difficultQuizzes.length >= requirement.count;
                }
              } else {
                isUnlocked = true;
              }
            }
          }
          break;

        case "puzzle_completed":
          if (activityType === "puzzle") {
            const puzzleCount = userProgress.puzzles.length;
            isUnlocked = requirement.count && puzzleCount >= requirement.count;
          }
          break;

        case "reading_completed":
          if (activityType === "reading") {
            const completedReadings = userProgress.readings.filter(
              (r) => r.isCompleted
            );
            isUnlocked =
              requirement.count &&
              completedReadings.length >= requirement.count;
          }
          break;

        case "streak":
          // Check both login streak and quiz streak
          if (
            userProgress.stats.loginStreak >= requirement.days ||
            userProgress.stats.quizStreak >= requirement.days
          ) {
            isUnlocked = true;
          }
          break;

        case "runes_learned":
          // For rune collection achievements
          if (requirement.category && requirement.count) {
            // This would need more implementation based on how we track learned runes
            // For now, using the runesLearned stat as a simple approximation
            isUnlocked = userProgress.stats.runesLearned >= requirement.count;
          }
          break;
      }

      // If achievement should be unlocked, add it
      if (isUnlocked) {
        userProgress.achievements.push({
          achievement: achievement._id,
          unlockedAt: new Date(),
        });

        // Add points to user's total
        userProgress.stats.totalPoints += achievement.points;

        newlyUnlocked.push(achievement);
      }
    }

    // Save user progress if any achievements were unlocked
    if (newlyUnlocked.length > 0) {
      await userProgress.save();
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("Achievement check error:", error);
    return [];
  }
};
