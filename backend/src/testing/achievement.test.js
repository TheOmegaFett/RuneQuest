const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const { generateTestToken } = require("./helpers/authHelper");

// Move mockObjectId creation outside of mock functions
const mockObjectId = () => "mockid" + Math.floor(Math.random() * 10000);

// Generate tokens for different user types
const adminToken = generateTestToken("adminUserId");
const regularToken = generateTestToken("regularUserId");

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
      _id: mockObjectId(),
      ...data,
    };
    return Promise.resolve(newAchievement);
  });

  return MockAchievement;
});

// Mock User model for admin checks
jest.mock("../models/User", () => {
  function MockUser(data) {
    if (data) Object.assign(this, data);
  }

  MockUser.findById = jest.fn().mockImplementation((id) => {
    // Consider adminUserId as admin
    const isAdmin = id === "adminUserId";
    return Promise.resolve({
      _id: id,
      isAdmin,
    });
  });

  return MockUser;
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

    it("should allow filtering achievements by category", async () => {
      // Mock implementation for filtered results
      Achievement.find.mockImplementationOnce(() => {
        return {
          lean: jest.fn().mockResolvedValue([mockAchievements[0]]),
        };
      });

      const response = await request(app).get(
        "/api/achievements?category=quiz"
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe("quiz");
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
    it("should create a new achievement when admin authenticated", async () => {
      const newAchievement = {
        name: "Rune Master",
        description: "Complete 10 hard quizzes",
        category: "quiz",
        requirement: { type: "quiz_completed", count: 10, difficulty: "hard" },
        points: 30,
      };

      const response = await request(app)
        .post("/api/achievements")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(newAchievement);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Rune Master");
    });

    it("should reject achievement creation for non-admin users", async () => {
      const newAchievement = {
        name: "Unauthorized Achievement",
        description: "This should not be created",
        category: "quiz",
        requirement: { type: "quiz_completed", count: 1 },
        points: 5,
      };

      const response = await request(app)
        .post("/api/achievements")
        .set("Authorization", `Bearer ${regularToken}`)
        .send(newAchievement);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it("should validate achievement data structure during creation", async () => {
      // Mock a validation error
      Achievement.create.mockImplementationOnce(() => {
        const error = new mongoose.Error.ValidationError();
        error.name = "ValidationError";
        error.errors = {
          name: { message: "Name is required" },
          points: { message: "Points must be a number" },
        };
        return Promise.reject(error);
      });

      const invalidAchievement = {
        // Missing required fields
        description: "Invalid achievement",
        category: "quiz",
      };

      const response = await request(app)
        .post("/api/achievements")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(invalidAchievement);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
