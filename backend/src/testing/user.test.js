/**
 * Test suite for User Controller functionality
 * @module tests/userController
 * @requires mongoose
 * @requires ../models/User
 * @requires ../controllers/userController
 */

const mongoose = require("mongoose");
const User = require("../models/User");
const userController = require("../controllers/userController");

// Mock response and request objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}) => ({
  body,
  params,
});

describe("User Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should create a new user", async () => {
      const mockUser = {
        username: "testUser",
        password: "password123",
        preferences: {
          theme: "light",
          notifications: true,
        },
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      const req = mockRequest(mockUser);
      const res = mockResponse();

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { username: "user1", preferences: {} },
        { username: "user2", preferences: {} },
      ];

      User.find = jest.fn().mockResolvedValue(mockUsers);

      const req = mockRequest();
      const res = mockResponse();

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockUsers.length,
        data: mockUsers,
      });
    });
  });

  describe("getOneUser", () => {
    it("should return a specific user", async () => {
      const mockUser = { username: "testUser", preferences: {} };
      User.findById = jest.fn().mockResolvedValue(mockUser);

      const req = mockRequest({}, { userId: "testId" });
      const res = mockResponse();

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });
  });

  describe("updateUserSettings", () => {
    it("should update user settings data", async () => {
      const updatedUser = {
        username: "updatedUser",
        password: "testPassword",
        preferences: { theme: "dark" },
      };

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

      const req = mockRequest(updatedUser, { userId: "testId" });
      const res = mockResponse();

      await userController.updateUserSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedUser,
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const mockUser = { username: "deletedUser" };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      const req = mockRequest({}, { userId: "testId" });
      const res = mockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });
  });
});
