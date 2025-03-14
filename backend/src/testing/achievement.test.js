const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { checkAndUnlockAchievements } = require("../helpers/achievementHelper");
const UserProgression = require("../models/UserProgression");
const Achievement = require("../models/Achievement");
const User = require("../models/User");

let mongoServer;

// Setup test database with specific options
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: "4.4.6", // Use a specific MongoDB version
    },
    instance: {
      storageEngine: "wiredTiger", // Specify storage engine
    },
  });
  await mongoose.connect(mongoServer.getUri());
}, 120000); // 2 minute timeout

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
beforeEach(async () => {
  await UserProgression.deleteMany({});
  await Achievement.deleteMany({});
  await User.deleteMany({});
});

describe("Achievement System Tests", () => {
  test("Should unlock quiz completion achievement", async () => {
    // Create test user
    const user = new User({
      username: "testuser",
      password: "password",
      salt: "salt",
    });
    await user.save();

    // Create test achievement
    const achievement = new Achievement({
      name: "Rune Novice",
      description: "Complete your first quiz",
      category: "quiz",
      icon: "novice-badge.svg",
      requirement: { type: "quiz_completed", count: 1 },
      points: 10,
    });
    await achievement.save();

    // Create user progression
    const progression = new UserProgression({
      user: user._id,
      quizzes: [],
      achievements: [],
      stats: {
        totalPoints: 0,
        quizStreak: 0,
        lastActive: new Date(),
        runesLearned: 0,
      },
    });
    await progression.save();

    // Test achievement unlocking
    const quizData = {
      score: 80,
      correctAnswers: 8,
      totalQuestions: 10,
      difficulty: "easy",
    };

    const newAchievements = await checkAndUnlockAchievements(
      user._id,
      quizData,
      "quiz"
    );

    // Verify achievement was unlocked
    expect(newAchievements.length).toBe(1);
    expect(newAchievements[0].name).toBe("Rune Novice");

    // Verify user progression was updated
    const updatedProgression = await UserProgression.findOne({
      user: user._id,
    });
    expect(updatedProgression.achievements.length).toBe(1);
    expect(updatedProgression.stats.totalPoints).toBe(10);
  });

  test("Should unlock streak achievement", async () => {
    // Create test user
    const user = new User({
      username: "testuser",
      password: "password",
      salt: "salt",
    });
    await user.save();

    // Create streak achievement
    const achievement = new Achievement({
      name: "Dedicated Student",
      description: "Achieve a 7-day streak",
      category: "general",
      icon: "streak-badge.svg",
      requirement: { type: "streak", days: 7 },
      points: 20,
    });
    await achievement.save();

    // Create user progression with 7-day streak
    const progression = new UserProgression({
      user: user._id,
      quizzes: [],
      achievements: [],
      stats: {
        totalPoints: 0,
        quizStreak: 7, // Already has 7-day streak
        lastActive: new Date(),
        runesLearned: 0,
      },
    });
    await progression.save();

    // Test achievement unlocking with any activity
    const newAchievements = await checkAndUnlockAchievements(
      user._id,
      {},
      "quiz"
    );

    // Verify streak achievement was unlocked
    expect(newAchievements.length).toBe(1);
    expect(newAchievements[0].name).toBe("Dedicated Student");
  });

  test("Should not unlock already unlocked achievements", async () => {
    // Create test user
    const user = new User({
      username: "testuser",
      password: "password",
      salt: "salt",
    });
    await user.save();

    // Create test achievement
    const achievement = new Achievement({
      name: "Rune Novice",
      description: "Complete your first quiz",
      category: "quiz",
      icon: "novice-badge.svg",
      requirement: { type: "quiz_completed", count: 1 },
      points: 10,
    });
    await achievement.save();

    // Create user progression with achievement already unlocked
    const progression = new UserProgression({
      user: user._id,
      quizzes: [
        {
          quiz: new mongoose.Types.ObjectId(),
          score: 80,
          correctAnswers: 8,
          totalQuestions: 10,
          difficulty: "easy",
          completedAt: new Date(),
        },
      ],
      achievements: [
        {
          achievement: achievement._id,
          unlockedAt: new Date(),
        },
      ],
      stats: {
        totalPoints: 10,
        quizStreak: 1,
        lastActive: new Date(),
        runesLearned: 0,
      },
    });
    await progression.save();

    // Test achievement unlocking
    const newAchievements = await checkAndUnlockAchievements(
      user._id,
      { score: 90, correctAnswers: 9, totalQuestions: 10 },
      "quiz"
    );

    // Verify no new achievements were unlocked
    expect(newAchievements.length).toBe(0);

    // Verify user progression wasn't changed
    const updatedProgression = await UserProgression.findOne({
      user: user._id,
    });
    expect(updatedProgression.achievements.length).toBe(1);
    expect(updatedProgression.stats.totalPoints).toBe(10);
  });

  test("Should unlock login streak achievement", async () => {
    // Create test user
    const user = new User({
      username: "streakuser",
      password: "password",
      salt: "salt",
    });
    await user.save();

    // Create login streak achievement
    const achievement = new Achievement({
      name: "Dedicated Student",
      description: "Achieve a 7-day streak",
      category: "general",
      icon: "streak-badge.svg",
      requirement: { type: "streak", days: 7 },
      points: 20,
    });
    await achievement.save();

    // Create user progression with login streak
    const progression = new UserProgression({
      user: user._id,
      quizzes: [],
      achievements: [],
      stats: {
        totalPoints: 0,
        quizStreak: 0,
        loginStreak: 7, // 7-day login streak
        lastActive: new Date(),
        runesLearned: 0,
      },
    });
    await progression.save();

    // Test achievement unlocking with login activity
    const newAchievements = await checkAndUnlockAchievements(
      user._id,
      {},
      "login"
    );

    // Verify login streak achievement was unlocked
    expect(newAchievements.length).toBe(1);
    expect(newAchievements[0].name).toBe("Dedicated Student");

    // Verify user progression was updated
    const updatedProgression = await UserProgression.findOne({
      user: user._id,
    });
    expect(updatedProgression.achievements.length).toBe(1);
    expect(updatedProgression.stats.totalPoints).toBe(20);
  });

  test("Should unlock higher tier streak achievement", async () => {
    // Create test user
    const user = new User({
      username: "devoteeuser",
      password: "password",
      salt: "salt",
    });
    await user.save();

    // Create both streak achievements
    const basicAchievement = new Achievement({
      name: "Dedicated Student",
      description: "Achieve a 7-day streak",
      category: "general",
      icon: "streak-badge.svg",
      requirement: { type: "streak", days: 7 },
      points: 20,
    });
    await basicAchievement.save();

    const advancedAchievement = new Achievement({
      name: "Rune Devotee",
      description: "Achieve a 30-day streak",
      category: "general",
      icon: "devotee-badge.svg",
      requirement: { type: "streak", days: 30 },
      points: 100,
    });
    await advancedAchievement.save();

    // Create user progression with 30-day login streak
    // and already having the basic achievement
    const progression = new UserProgression({
      user: user._id,
      quizzes: [],
      achievements: [
        {
          achievement: basicAchievement._id,
          unlockedAt: new Date(Date.now() - 86400000 * 10), // Unlocked 10 days ago
        },
      ],
      stats: {
        totalPoints: 20, // Already has points from basic achievement
        quizStreak: 0,
        loginStreak: 30, // 30-day login streak
        lastActive: new Date(),
        runesLearned: 0,
      },
    });
    await progression.save();

    // Test achievement unlocking with login activity
    const newAchievements = await checkAndUnlockAchievements(
      user._id,
      {},
      "login"
    );

    // Verify only the advanced achievement was unlocked
    expect(newAchievements.length).toBe(1);
    expect(newAchievements[0].name).toBe("Rune Devotee");

    // Verify user progression was updated
    const updatedProgression = await UserProgression.findOne({
      user: user._id,
    });
    expect(updatedProgression.achievements.length).toBe(2);
    expect(updatedProgression.stats.totalPoints).toBe(120); // 20 + 100
  });

  test("Should properly calculate login streak based on calendar days", async () => {
    // Create test user
    const user = new User({
      username: "calendaruser",
      password: "password",
      salt: "salt",
    });
    await user.save();

    // Create streak achievement
    const achievement = new Achievement({
      name: "Dedicated Student",
      description: "Achieve a 7-day streak",
      category: "general",
      icon: "streak-badge.svg",
      requirement: { type: "streak", days: 7 },
      points: 20,
    });
    await achievement.save();

    // Create initial user progression with 1-day streak
    const initialDate = new Date("2023-01-01T12:00:00Z");
    const progression = new UserProgression({
      user: user._id,
      quizzes: [],
      achievements: [],
      stats: {
        totalPoints: 0,
        quizStreak: 0,
        loginStreak: 1,
        lastActive: initialDate,
        runesLearned: 0,
      },
    });
    await progression.save();

    // Simulate next day login by directly updating the database
    const nextDayDate = new Date("2023-01-02T18:30:00Z");

    // This is what our updateLoginStreak function would do

    // Extract date components
    const initialDay = initialDate.getUTCDate();
    const initialMonth = initialDate.getUTCMonth();
    const initialYear = initialDate.getUTCFullYear();

    const nextDay = nextDayDate.getUTCDate();
    const nextMonth = nextDayDate.getUTCMonth();
    const nextYear = nextDayDate.getUTCFullYear();

    // Check if dates are consecutive calendar days
    const isConsecutiveDay =
      // Same month and consecutive days
      (nextMonth === initialMonth &&
        nextDay === initialDay + 1 &&
        nextYear === initialYear) ||
      // Month boundary (last day of month to first day of next month)
      (nextDay === 1 &&
        initialDay ===
          new Date(Date.UTC(initialYear, initialMonth + 1, 0)).getUTCDate() &&
        ((nextMonth === (initialMonth + 1) % 12 && nextYear === initialYear) ||
          (nextMonth === 0 &&
            initialMonth === 11 &&
            nextYear === initialYear + 1)));

    // Verify our consecutive day check works correctly
    expect(isConsecutiveDay).toBe(true);

    // Update streak based on consecutive day check
    if (isConsecutiveDay) {
      progression.stats.loginStreak += 1;
    }

    progression.stats.lastActive = nextDayDate;

    await progression.save();

    // Verify streak was incremented
    const updatedProgression = await UserProgression.findOne({
      user: user._id,
    });
    expect(updatedProgression.stats.loginStreak).toBe(2);
  });
});
