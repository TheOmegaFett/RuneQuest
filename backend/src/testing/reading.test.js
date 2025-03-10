/**
 * Test suite for Reading Controller functionality
 * @module tests/readingController
 * @requires mongoose
 * @requires ../models/Reading
 * @requires ../controllers/readingController
 */

const mongoose = require("mongoose");
const Reading = require("../models/Reading");
const readingController = require("../controllers/readingController");

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

describe("Reading Controller Tests", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createReading", () => {
    it("should create a new reading", async () => {
      // Setup mock reading data

      const mockReading = {
        runes: ["rune1", "rune2"],
        interpretation: "Test reading",
        user: "mockUserId",
      };
      // Mock database operation
      Reading.create = jest.fn().mockResolvedValue(mockReading);

      const req = mockRequest(mockReading, { userId: "mockUserId" });
      const res = mockResponse();
      await readingController.createReading(req, res);

      // Verify response matches controller format
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReading,
      });
    });
  });

  describe("getAllReadings", () => {
    it("should return all readings", async () => {
      const mockReadings = [
        { runes: ["rune1"], interpretation: "Reading 1" },
        { runes: ["rune2"], interpretation: "Reading 2" },
      ];
      Reading.find = jest.fn().mockResolvedValue(mockReadings);

      const req = mockRequest();
      const res = mockResponse();

      await readingController.getAllReadings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReadings);
    });
  });

  describe("getReadingById", () => {
    it("should return a reading by id", async () => {
      const mockReading = { _id: "reading1", interpretation: "Test reading" };
      Reading.findById = jest.fn().mockResolvedValue(mockReading);

      const req = mockRequest({}, { id: "reading1" });
      const res = mockResponse();

      await readingController.getReadingById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReading);
    });
  });

  describe("updateReading", () => {
    it("should update a reading", async () => {
      const updatedReading = { interpretation: "Updated reading" };
      Reading.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedReading);

      const req = mockRequest(updatedReading, { id: "reading1" });
      const res = mockResponse();

      await readingController.updateReading(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedReading);
    });
  });

  describe("deleteReading", () => {
    it("should delete a reading", async () => {
      Reading.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue({ _id: "reading1" });

      const req = mockRequest({}, { id: "reading1" });
      const res = mockResponse();

      await readingController.deleteReading(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Reading deleted successfully",
      });
    });
  });
});
