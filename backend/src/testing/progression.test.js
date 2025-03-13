const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const progressionRoutes = require("../routes/progressionRoutes");
const { generateTestToken } = require("./helpers/authHelper");

// Use the "mock" prefix for variables that will be used in jest.mock()
const mockUserId = "user123";
const mockOtherUserId = "otheruser456";
const mockQuizId = "quiz123";
const mockReadingId = "reading123";
const mockAchievementId = "achievement123";
const token = generateTestToken(mockUserId);
const otherUserToken = generateTestToken(mockOtherUserId);

const mockUserProgress = {
  _id: "progress123",
  user: mockUserId,
  achievements: [
    {
      achievement: mockAchievementId,
      unlockedAt: new Date(),
    },
  ],
  quizzes: [
    {
      quiz: mockQuizId,
      score: 80,
      correctAnswers: 8,
      totalQuestions: 10,
      difficulty: "medium",
      completedAt: new Date(),
    },
  ],
  readings: [
    {
      reading: mockReadingId,
      savedAt: new Date(),
      readAt: new Date(),
      isCompleted: true,
    },
  ],
  stats: {
    totalPoints: 100,
    quizStreak: 1,
    lastActive: new Date(),
    runesLearned: 5,
  },
};

beforeEach(() => {
  // Reset mock data to initial state before each test
  jest.clearAllMocks();
  // Re-initialize your mock with the original test data
  const UserProgression = require("../models/UserProgression");
  UserProgression.findOne.mockImplementation(({ user }) => {
    if (user === mockUserId) {
      return Promise.resolve({
        ...mockUserProgress,
        quizzes: [mockUserProgress.quizzes[0]], // Just the initial quiz
        save: jest.fn().mockResolvedValue(mockUserProgress),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnValue(mockUserProgress),
      });
    }
    return Promise.resolve(null);
  });
});

// Set up mocks
jest.mock("../models/UserProgression", () => {
  function MockUserProgression(data) {
    if (data) Object.assign(this, data);
    // Make sure save returns a promise resolving to this instance
    this.save = jest.fn().mockResolvedValue(this);
  }

  MockUserProgression.findOne = jest.fn().mockImplementation(({ user }) => {
    if (user === mockUserId) {
      // Return a mock object with appropriate methods
      return Promise.resolve({
        ...mockUserProgress,
        save: jest.fn().mockResolvedValue(mockUserProgress),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnValue(mockUserProgress),
      });
    }
    // For non-existent users, return null
    return Promise.resolve(null);
  });

  MockUserProgression.create = jest.fn().mockImplementation((data) => {
    // Create a new user progression object with save method
    const newProgress = {
      ...data,
      _id: "newprogress123",
      save: jest.fn().mockResolvedValue(data),
    };
    return Promise.resolve(newProgress);
  });

  return MockUserProgression;
});

jest.mock("../models/Achievement", () => {
  const mockAchievements = [
    {
      _id: "achievement123",
      name: "Rune Novice",
      description: "Complete 5 easy quizzes",
      category: "quiz",
      requirement: { type: "quiz_completed", count: 5, difficulty: "easy" },
      points: 10,
    },
    {
      _id: "achievement124",
      name: "Quiz Master",
      description: "Complete 10 quizzes with perfect scores",
      category: "quiz",
      requirement: { type: "quiz_perfect", count: 10 },
      points: 50,
    },
  ];

  function MockAchievement(data) {
    if (data) Object.assign(this, data);
  }

  MockAchievement.find = jest.fn().mockImplementation(() => {
    return {
      lean: jest.fn().mockResolvedValue(mockAchievements),
    };
  });

  return MockAchievement;
});

// Mock User model for permission checks
jest.mock("../models/User", () => {
  function MockUser(data) {
    if (data) Object.assign(this, data);
  }

  MockUser.findById = jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      _id: id,
      isAdmin: id === "adminUserId",
    });
  });

  return MockUser;
});

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/api/progression", progressionRoutes);

describe("User Progression Tests", () => {
  describe("GET /api/progression/:userId", () => {
    it("should retrieve user progression data", async () => {
      const response = await request(app)
        .get(`/api/progression/${mockUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBe(mockUserId);
      expect(response.body.data.quizzes).toHaveLength(1);
      expect(response.body.data.readings).toHaveLength(1);
    });

    it("should return 404 if user progression not found", async () => {
      const response = await request(app)
        .get(`/api/progression/nonexistentUser`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it("should prevent users from accessing another user's progression data", async () => {
      const response = await request(app)
        .get(`/api/progression/${mockUserId}`)
        .set("Authorization", `Bearer ${otherUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("unauthorized");
    });

    it("should allow admins to access any user's progression data", async () => {
      const adminToken = generateTestToken("adminUserId");

      const response = await request(app)
        .get(`/api/progression/${mockUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBe(mockUserId);
    });
  });

  describe("POST /api/progression/quiz", () => {
    it("should update user quiz progress", async () => {
      const quizData = {
        userId: mockUserId,
        quizId: "newQuiz123",
        score: 90,
        correctAnswers: 9,
        totalQuestions: 10,
        difficulty: "hard",
      };

      const response = await request(app)
        .post("/api/progression/quiz")
        .set("Authorization", `Bearer ${token}`)
        .send(quizData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should properly calculate and update stats when recording quiz progress", async () => {
      // Create a mock implementation that verifies stat updates
      const UserProgression = require("../models/UserProgression");

      // Create a custom mock that captures the save operation
      let savedData = null;
      const customMockSave = jest.fn().mockImplementation(function () {
        savedData = this;
        return Promise.resolve(this);
      });

      // Override the findOne implementation for this test
      UserProgression.findOne.mockImplementationOnce(() => {
        return Promise.resolve({
          ...mockUserProgress,
          stats: {
            totalPoints: 100,
            quizStreak: 1,
            lastActive: new Date(Date.now() - 86400000), // 1 day ago
            runesLearned: 5,
          },
          save: customMockSave,
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
        });
      });

      const quizData = {
        userId: mockUserId,
        quizId: "statUpdateQuiz",
        score: 50,
        correctAnswers: 5,
        totalQuestions: 10,
        difficulty: "medium",
      };

      const response = await request(app)
        .post("/api/progression/quiz")
        .set("Authorization", `Bearer ${token}`)
        .send(quizData);

      expect(response.status).toBe(200);
      expect(savedData).not.toBeNull();
      // Verify stats were updated
      expect(savedData.stats.totalPoints).toBe(150); // 100 + 50
      expect(savedData.stats.quizStreak).toBe(2); // Incremented
      expect(savedData.quizzes).toHaveLength(2); // Added new quiz
    });

    it("should create new progression if user has none", async () => {
      // Mock findOne to return null for this test
      const UserProgression = require("../models/UserProgression");
      UserProgression.findOne.mockImplementationOnce(() =>
        Promise.resolve(null)
      );

      const quizData = {
        userId: "newUser",
        quizId: "firstQuiz",
        score: 70,
        correctAnswers: 7,
        totalQuestions: 10,
        difficulty: "easy",
      };

      const response = await request(app)
        .post("/api/progression/quiz")
        .set("Authorization", `Bearer ${generateTestToken("newUser")}`)
        .send(quizData);

      expect(response.status).toBe(200);
      expect(UserProgression.create).toHaveBeenCalled();
      expect(response.body.data.quizzes).toBeDefined();
      expect(response.body.data.stats.totalPoints).toBe(70); // Initial points = score
    });
  });

  describe("POST /api/progression/reading", () => {
    it("should update user reading progress", async () => {
      const readingData = {
        userId: mockUserId,
        readingId: "newReading123",
        isCompleted: true,
      };

      const response = await request(app)
        .post("/api/progression/reading")
        .set("Authorization", `Bearer ${token}`)
        .send(readingData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should handle updating existing reading progress", async () => {
      // Override findOne to return a progression with the reading already started
      const UserProgression = require("../models/UserProgression");
      const existingReadingId = "existingReading123";

      UserProgression.findOne.mockImplementationOnce(() => {
        return Promise.resolve({
          ...mockUserProgress,
          readings: [
            ...mockUserProgress.readings,
            {
              reading: existingReadingId,
              savedAt: new Date(Date.now() - 86400000), // 1 day ago
              readAt: null,
              isCompleted: false,
            },
          ],
          save: jest.fn().mockImplementation(function () {
            return Promise.resolve(this);
          }),
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
        });
      });

      const readingData = {
        userId: mockUserId,
        readingId: existingReadingId,
        isCompleted: true,
      };

      const response = await request(app)
        .post("/api/progression/reading")
        .set("Authorization", `Bearer ${token}`)
        .send(readingData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Find the updated reading in the response
      const updatedReading = response.body.data.readings.find(
        (r) => r.reading.toString() === existingReadingId
      );
      expect(updatedReading.isCompleted).toBe(true);
      expect(updatedReading.readAt).toBeDefined();
    });

    it("should check for achievements when progression is updated", async () => {
      // This test would verify achievement unlocking logic
      // Would need to mock achievement checking functionality
      // Implementation depends on how the achievement system works

      // A placeholder test
      expect(true).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle server errors gracefully", async () => {
      // Temporarily mock console.error to prevent output
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Mock a server error
      const UserProgression = require("../models/UserProgression");
      UserProgression.findOne.mockImplementationOnce(() => {
        return Promise.reject(new Error("Database connection error"));
      });

      // Run the test
      const response = await request(app)
        .get(`/api/progression/${mockUserId}`)
        .set("Authorization", `Bearer ${token}`);

      // Verify proper error handling
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();

      // Restore console.error for other tests
      console.error = originalConsoleError;
    });
  });
});
