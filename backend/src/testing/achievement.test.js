const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");

// Move mockObjectId creation outside of mock functions
const mockObjectId = () => "mockid" + Math.floor(Math.random() * 10000);

// Define mock data
const mockAchievements = [
  {
    _id: mockObjectId(),
    name: "Rune Novice",
    description: "Complete 5 easy quizzes",
    category: "quiz",
    requirement: { type: "quiz_completed", count: 5, difficulty: "easy" },
    points: 10,
  },
  {
    _id: mockObjectId(),
    name: "Rune Scholar",
    description: "Complete 10 readings",
    category: "reading",
    requirement: { type: "reading_completed", count: 10 },
    points: 20,
  },
];

// Set up mocks
jest.mock("../models/Achievement", () => {
  function MockAchievement(data) {
    if (data) Object.assign(this, data);
  }

  MockAchievement.find = jest.fn().mockImplementation(() => {
    return {
      lean: jest.fn().mockResolvedValue(mockAchievements),
    };
  });

  MockAchievement.findById = jest.fn().mockImplementation((id) => {
    return {
      lean: jest
        .fn()
        .mockResolvedValue(
          mockAchievements.find((a) => a._id.toString() === id.toString())
        ),
    };
  });

  MockAchievement.create = jest.fn().mockImplementation((data) => {
    const newAchievement = {
      _id: mockObjectId(), // Use our helper instead of mongoose directly
      ...data,
    };
    return Promise.resolve(newAchievement);
  });

  return MockAchievement;
});
// Import after mocking
const Achievement = require("../models/Achievement");
const achievementRoutes = require("../routes/achievementRoutes");

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/api/achievements", achievementRoutes);

describe("Achievement Feature Tests", () => {
  afterAll(async () => {
    jest.resetAllMocks();
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  describe("GET /api/achievements", () => {
    it("should return all achievements", async () => {
      const response = await request(app).get("/api/achievements");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe("Rune Novice");
    });
  });

  describe("GET /api/achievements/:id", () => {
    it("should return a single achievement by ID", async () => {
      const id = mockAchievements[0]._id.toString();
      const response = await request(app).get(`/api/achievements/${id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Rune Novice");
    });

    it("should return 404 if achievement not found", async () => {
      // Mock findById to return null for this test
      Achievement.findById.mockImplementationOnce(() => {
        return {
          lean: jest.fn().mockResolvedValue(null),
        };
      });

      const response = await request(app).get(`/api/achievements/nonexistent`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/achievements", () => {
    it("should create a new achievement", async () => {
      const newAchievement = {
        name: "Rune Master",
        description: "Complete 10 hard quizzes",
        category: "quiz",
        requirement: { type: "quiz_completed", count: 10, difficulty: "hard" },
        points: 30,
      };

      const response = await request(app)
        .post("/api/achievements")
        .send(newAchievement);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Rune Master");
    });
  });
});
