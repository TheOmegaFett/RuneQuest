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
const jwt = require("jsonwebtoken");

// Mock response and request objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, headers = {}) => ({
  body,
  params,
  headers,
  get: jest.fn((key) => headers[key]),
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
        token: expect.any(String),
      });
    });

    it("should handle validation errors during registration", async () => {
      const invalidUser = {
        // Missing required fields
        username: "",
        password: "123", // Too short
      };

      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        username: new mongoose.Error.ValidatorError({
          message: "Username is required",
        }),
        password: new mongoose.Error.ValidatorError({
          message: "Password must be at least 6 characters",
        }),
      };

      User.create = jest.fn().mockRejectedValue(validationError);

      const req = mockRequest(invalidUser);
      const res = mockResponse();

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String),
      });
    });
  });

  describe("loginUser", () => {
    it("should log in a user with correct credentials", async () => {
      const mockUser = {
        _id: "user123",
        username: "testUser",
        password: "encryptedPassword",
        salt: "testSalt",
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const req = mockRequest({
        username: "testUser",
        password: "password123",
      });
      const res = mockResponse();

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        userId: mockUser._id,
        token: expect.any(String),
      });
    });

    it("should reject login with incorrect credentials", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const req = mockRequest({
        username: "wrongUser",
        password: "wrongPassword",
      });
      const res = mockResponse();

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Username or password incorrect",
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

    it("should handle database errors when retrieving users", async () => {
      const dbError = new Error("Database connection failed");
      User.find = jest.fn().mockRejectedValue(dbError);

      const req = mockRequest();
      const res = mockResponse();

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: dbError.message,
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

    it("should return 404 if user not found", async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      const req = mockRequest({}, { userId: "nonexistentId" });
      const res = mockResponse();

      await userController.getOneUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "User not found",
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

    it("should handle errors during settings update", async () => {
      const updateError = new Error("Update failed");
      User.findByIdAndUpdate = jest.fn().mockRejectedValue(updateError);

      const req = mockRequest(
        { username: "test", password: "test", preferences: {} },
        { userId: "testId" }
      );
      const res = mockResponse();

      await userController.updateUserSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: updateError.message,
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const mockUser = { username: "deletedUser" };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      // Set up authenticated user
      const userId = "testId";
      const req = mockRequest({}, { userId: userId });
      req.userId = userId; // Add this to simulate authenticated user
      const res = mockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it("should return 404 if user to delete is not found", async () => {
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const userId = "nonexistentId";
      const req = mockRequest({}, { userId });
      req.userId = userId; // Authenticated as the same user

      const res = mockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "User not found",
      });
    });

    it("should prevent non-admin users from deleting other users", async () => {
      // Setup: Authenticated user is different from the user being deleted
      const authenticatedUserId = "authUser123";
      const targetUserId = "targetUser456";

      // Mock the user lookup to return a non-admin user
      const mockAuthUser = { _id: authenticatedUserId, isAdmin: false };
      User.findById = jest.fn().mockResolvedValue(mockAuthUser);

      const req = mockRequest({}, { userId: targetUserId });
      req.userId = authenticatedUserId;
      const res = mockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Not authorized to delete other user accounts",
      });
    });

    it("should allow admin users to delete any user", async () => {
      // Setup: Admin tries to delete another user
      const adminUserId = "admin123";
      const targetUserId = "targetUser456";

      // Mock an admin user
      const mockAdminUser = { _id: adminUserId, isAdmin: true };
      User.findById = jest.fn().mockResolvedValue(mockAdminUser);

      // Mock the deletion target
      const deletedUser = { _id: targetUserId, username: "deletedUser" };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(deletedUser);

      const req = mockRequest({}, { userId: targetUserId });
      req.userId = adminUserId;
      const res = mockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: deletedUser,
      });
    });
  });

  describe("deleteAllUsers", () => {
    it("should allow admin to delete all users", async () => {
      // Setup: Admin tries to delete all users
      const adminUserId = "admin123";

      // Mock an admin user
      const mockAdminUser = { _id: adminUserId, isAdmin: true };
      User.findById = jest.fn().mockResolvedValue(mockAdminUser);

      // Mock the deletion operation
      User.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 10 });

      const req = mockRequest();
      req.userId = adminUserId;
      const res = mockResponse();

      await userController.deleteAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "All users deleted",
      });
    });

    it("should prevent non-admin users from deleting all users", async () => {
      // Setup: Non-admin tries to delete all users
      const regularUserId = "user123";

      // Mock a regular user
      const mockRegularUser = { _id: regularUserId, isAdmin: false };
      User.findById = jest.fn().mockResolvedValue(mockRegularUser);

      const req = mockRequest();
      req.userId = regularUserId;
      const res = mockResponse();

      await userController.deleteAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Admin privileges required for this operation",
      });
    });
  });
});
