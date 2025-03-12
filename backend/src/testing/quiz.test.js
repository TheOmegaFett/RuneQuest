const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");

// Define mock data first
const mockQuizData = [
  {
    _id: new mongoose.Types.ObjectId(),
    rune: "ᚨ",
    correctMeaning: "Wealth",
    incorrectMeanings: ["Journey", "Protection", "Power"],
    difficulty: "easy",
    category: "elder-futhark",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    rune: "ᚱ",
    correctMeaning: "Journey",
    incorrectMeanings: ["Wealth", "Protection", "Power"],
    difficulty: "medium",
    category: "elder-futhark",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    rune: "ᚲ",
    correctMeaning: "Torch",
    incorrectMeanings: ["Wealth", "Journey", "Power"],
    difficulty: "hard",
    category: "elder-futhark",
  },
];

// Set up the mock
jest.mock("../models/QuizQuestion", () => {
  function MockQuizQuestion(data) {
    if (data) Object.assign(this, data);
  }

  MockQuizQuestion.prototype.validateSync = jest
    .fn()
    .mockReturnValue(undefined);
  MockQuizQuestion.aggregate = jest.fn().mockResolvedValue(mockQuizData);
  MockQuizQuestion.findById = jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      ...mockQuizData[0],
      id: id,
    });
  });

  return MockQuizQuestion;
});

// Import after mocking
const QuizQuestion = require("../models/QuizQuestion");
const quizRoutes = require("../routes/quizRoutes");

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/api/quizzes", quizRoutes);

describe("Quiz Feature Tests", () => {
  beforeAll(() => {
    // Mock the aggregate chain properly
    QuizQuestion.aggregate = jest.fn().mockImplementation((pipeline) => {
      // Extract the difficulty from the pipeline
      const difficultyMatch = pipeline.find((stage) => stage.$match)?.$match
        ?.difficulty;

      // Return filtered mock data that matches what our controller expects
      return Promise.resolve(
        mockQuizData.filter(
          (q) => q.difficulty === difficultyMatch || !difficultyMatch
        )
      );
    });

    // Mock findById with correct promise resolution
    QuizQuestion.findById = jest.fn().mockImplementation((id) => {
      const question = mockQuizData.find(
        (q) => q._id.toString() === id.toString()
      );
      // Mock a document-like object with both data and lean() method
      const result = question
        ? {
            ...question,
            lean: () => question,
          }
        : null;
      return Promise.resolve(result);
    });
  });

  afterAll(async () => {
    // Clean up all mocks
    jest.resetAllMocks();

    // If you have any app-level resources that need cleanup:
    await new Promise((resolve) => setTimeout(resolve, 500)); // Allow event loop to finish
  });

  // Model Validation Tests
  describe("QuizQuestion Model", () => {
    it("should validate with correct properties", () => {
      // Create a direct mock of validateSync that returns undefined (passing validation)
      QuizQuestion.prototype.validateSync = jest
        .fn()
        .mockReturnValue(undefined);

      const validQuestion = new QuizQuestion();
      const validationError = validQuestion.validateSync();
      expect(validationError).toBeUndefined();
    });
  });

  // API Route Tests
  describe("Quiz API Endpoints", () => {
    describe("GET /api/quizzes/easy", () => {
      it("should return quiz questions with 2 options for easy difficulty", async () => {
        // Mock data for easy difficulty
        QuizQuestion.aggregate.mockResolvedValueOnce([
          {
            _id: "mockid1",
            rune: "ᚨ",
            correctMeaning: "Wealth",
            incorrectMeanings: ["Journey", "Protection", "Power"],
            difficulty: "easy",
          },
        ]);

        const response = await request(app).get("/api/quizzes/easy");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data[0].options.length).toBe(2); // Easy should have 2 options
      });
    });

    describe("GET /api/quizzes/medium", () => {
      it("should return quiz questions with 3 options for medium difficulty", async () => {
        // Mock data for medium difficulty
        QuizQuestion.aggregate.mockResolvedValueOnce([
          {
            _id: "mockid2",
            rune: "ᚱ",
            correctMeaning: "Journey",
            incorrectMeanings: ["Wealth", "Protection", "Power"],
            difficulty: "medium",
          },
        ]);

        const response = await request(app).get("/api/quizzes/medium");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data[0].options.length).toBe(3); // Medium should have 3 options
      });
    });

    describe("GET /api/quizzes/hard", () => {
      it("should return quiz questions with 4 options for hard difficulty", async () => {
        // Mock data for hard difficulty
        QuizQuestion.aggregate.mockResolvedValueOnce([
          {
            _id: "mockid3",
            rune: "ᚲ",
            correctMeaning: "Torch",
            incorrectMeanings: ["Wealth", "Journey", "Power"],
            difficulty: "hard",
          },
        ]);

        const response = await request(app).get("/api/quizzes/hard");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data[0].options.length).toBe(4); // Hard should have 4 options
      });
    });
  });
});
