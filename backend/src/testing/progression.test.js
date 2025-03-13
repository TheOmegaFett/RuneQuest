const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const progressionRoutes = require("../routes/progressionRoutes");

// Use the "mock" prefix for variables that will be used in jest.mock()
const mockUserId = "user123";
const mockQuizId = "quiz123";
const mockReadingId = "reading123";
const mockAchievementId = "achievement123";

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
  function MockAchievement(data) {
    if (data) Object.assign(this, data);
  }

  MockAchievement.find = jest.fn().mockImplementation(() => {
    return {
      lean: jest.fn().mockResolvedValue([]),
    };
  });

  return MockAchievement;
});

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/api/progression", progressionRoutes);

describe("User Progression Tests", () => {
  describe("GET /api/progression/:userId", () => {
    it("should retrieve user progression data", async () => {
      const response = await request(app).get(`/api/progression/${mockUserId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBe(mockUserId);
      expect(response.body.data.quizzes).toHaveLength(1);
      expect(response.body.data.readings).toHaveLength(1);
    });

    it("should return 404 if user progression not found", async () => {
      const response = await request(app).get(
        `/api/progression/nonexistentUser`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
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
        .send(quizData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
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
        .send(readingData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
