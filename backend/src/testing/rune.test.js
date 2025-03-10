/**
 * Test suite for Rune Controller functionality
 * @module tests/runeController
 * @requires mongoose
 * @requires ../models/Rune
 * @requires ../controllers/runeController
 */

const mongoose = require("mongoose");
const Rune = require("../models/Rune");
const runeController = require("../controllers/runeController");

/**
 * Creates a mock response object with jest functions
 * @returns {Object} Mock response object with status and json methods
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Creates a mock request object with body and params
 * @param {Object} body - Request body object
 * @param {Object} params - Request params object
 * @returns {Object} Mock request object
 */
const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
});

describe("Rune Controller Tests", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addRune", () => {
    it("should create a new rune", async () => {
      // Setup mock rune data
      const mockRune = {
        name: "TestRune",
        meaning: "Test Meaning",
        symbol: "†",
        pronunciation: "test",
        history: "Test history",
        category: "category1",
        relationships: [],
        audioFile: "audio1",
      };

      // Setup populated rune response
      const populatedRune = {
        ...mockRune,
        category: { name: "Category1" },
        relationships: [],
        audioFile: { url: "audio-url" },
      };
      // Mock database operations
      Rune.create = jest.fn().mockResolvedValue({ _id: "rune1", ...mockRune });
      Rune.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(populatedRune),
          }),
        }),
      });

      const req = mockRequest(mockRune);
      const res = mockResponse();

      await runeController.addRune(req, res);

      // Verify response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: populatedRune,
        message: "Rune successfully created",
      });
    });
  });

  describe("getAllRunes", () => {
    it("should return all runes", async () => {
      const mockRunes = [
        { name: "Rune1", symbol: "†" },
        { name: "Rune2", symbol: "‡" },
      ];

      Rune.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockRunes),
          }),
        }),
      });

      const req = mockRequest();
      const res = mockResponse();

      await runeController.getAllRunes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockRunes.length,
        data: mockRunes,
      });
    });
  });

  describe("deleteRune", () => {
    it("should delete a rune", async () => {
      const mockRune = { _id: "rune1", name: "DeletedRune" };
      Rune.findByIdAndDelete = jest.fn().mockResolvedValue(mockRune);

      const req = mockRequest({}, { id: "rune1" });
      const res = mockResponse();

      await runeController.deleteRune(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Rune successfully deleted",
        data: mockRune,
      });
    });

    it("should return 404 when rune not found", async () => {
      Rune.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const req = mockRequest({}, { id: "nonexistent" });
      const res = mockResponse();

      await runeController.deleteRune(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Rune not found",
      });
    });
  });
});
