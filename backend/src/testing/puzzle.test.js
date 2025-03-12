/**
 * Test suite for Puzzle Controller functionality
 * @module tests/puzzleController
 * @requires mongoose
 * @requires ../models/Puzzle
 * @requires ../controllers/puzzleController
 */

const mongoose = require("mongoose");
const Puzzle = require("../models/Puzzle");
const puzzleController = require("../controllers/puzzleController");

// Mock response and request objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

describe("Puzzle Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPuzzles", () => {
    it("should return all puzzles when no filters provided", async () => {
      const mockPuzzles = [
        { englishWord: "Thor", runeEquivalent: "ᚦᚮᚱ", category: "norse" },
        { englishWord: "Odin", runeEquivalent: "ᚮᚦᛁᚿ", category: "norse" },
      ];
      Puzzle.find = jest.fn().mockResolvedValue(mockPuzzles);
      const req = mockRequest({}, {}, {});
      const res = mockResponse();

      await puzzleController.getPuzzles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockPuzzles.length,
        data: mockPuzzles,
      });
    });
    it("should filter puzzles by difficulty", async () => {
      const mockPuzzles = [
        { englishWord: "Thor", runeEquivalent: "ᚦᚮᚱ", difficulty: "easy" },
      ];

      // Use consistent mocking pattern - direct promise resolution
      Puzzle.find = jest.fn().mockResolvedValue(mockPuzzles);

      const req = mockRequest({}, {}, { difficulty: "easy" });
      const res = mockResponse();

      await puzzleController.getPuzzles(req, res);

      expect(Puzzle.find).toHaveBeenCalledWith({ difficulty: "easy" });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockPuzzles.length,
        data: mockPuzzles,
      });
    });
  });

  describe("checkPuzzleAnswer", () => {
    it("should return true for correct answer", async () => {
      const mockPuzzle = {
        _id: "puzzle1",
        englishWord: "Thor",
        runeEquivalent: "ᚦᚮᚱ",
      };

      Puzzle.findById = jest.fn().mockResolvedValue(mockPuzzle);

      const req = mockRequest({
        puzzleId: "puzzle1",
        userAnswer: "Thor",
      });
      const res = mockResponse();

      await puzzleController.checkPuzzleAnswer(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          isCorrect: true,
          correctAnswer: null,
          message: "Correct! Well done.",
        },
      });
    });

    it("should return false for incorrect answer with correct solution", async () => {
      const mockPuzzle = {
        _id: "puzzle1",
        englishWord: "Thor",
        runeEquivalent: "ᚦᚮᚱ",
      };

      Puzzle.findById = jest.fn().mockResolvedValue(mockPuzzle);

      const req = mockRequest({
        puzzleId: "puzzle1",
        userAnswer: "Odin",
      });
      const res = mockResponse();

      await puzzleController.checkPuzzleAnswer(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          isCorrect: false,
          correctAnswer: "Thor",
          message: "Not quite right. Try again!",
        },
      });
    });

    it("should handle missing puzzle ID", async () => {
      const req = mockRequest({
        userAnswer: "Thor",
      });
      const res = mockResponse();

      await puzzleController.checkPuzzleAnswer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Please provide both puzzleId and userAnswer",
      });
    });
  });
});
