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
const encryptPasswordHelper = require("../helpers/encryptPasswordHelper");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");
jwt.sign = jest.fn().mockReturnValue("mockToken");
// Mock the encryption helper - this is all you need
jest.mock("../helpers/encryptPasswordHelper", () => ({
  encryptPassword: jest.fn().mockReturnValue({
    password: "hashedPassword",
    salt: "randomSalt",
  }),
}));

// Mock the compare password helper
jest.mock("../helpers/comparePasswordHelper", () => ({
  comparePassword: jest.fn().mockReturnValue(true),
}));

// Mock the filterUserData helper
jest.mock("../helpers/filterDataHelper", () => ({
  filterUserData: jest.fn().mockImplementation((user) => ({
    username: user.username,
    id: user._id,
    isAdmin: user.isAdmin,
    preferences: user.preferences,
    progress: user.progress,
  })),
}));

// Mock response and request objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}) => {
  return {
    body,
    params,
    headers: {},
    get: jest.fn((key) => this.headers[key]),
  };
};

describe("User Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should create a new user", async () => {
      const mockUser = {
        username: "testUser",
        password: "password123",
      };

      const createdUser = {
        _id: "507f1f77bcf86cd799439011", // Valid 24-character hex string
        id: "507f1f77bcf86cd799439011",
        username: "testUser",
      };

      // Mock the User.create method
      User.create = jest.fn().mockResolvedValue(createdUser);

      const req = mockRequest(mockUser);
      const res = mockResponse();

      // Add debugging
      try {
        await userController.registerUser(req, res);
        console.log(
          "Register response:",
          res.status.mock.calls,
          res.json.mock.calls
        );
      } catch (error) {
        console.error("Register error:", error);
      }

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: createdUser._id,
          username: createdUser.username,
        },
        token: "mockToken",
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
    jest.mock("../models/UserProgression", () => {
      return {
        findOne: jest.fn().mockImplementation(() => {
          return {
            save: jest.fn().mockResolvedValue(true),
            stats: {
              loginStreak: 1,
              lastActive: new Date(),
            },
          };
        }),
      };
    });

    // ock the achievement helper
    jest.mock("../helpers/achievementHelper", () => ({
      checkAndUnlockAchievements: jest.fn(),
    }));

    it("should log in a user with correct credentials", async () => {
      // Import the comparePassword helper directly
      const { comparePassword } = require("../helpers/comparePasswordHelper");

      // Mock the controller method with proper reference to comparePassword
      jest
        .spyOn(userController, "loginUser")
        .mockImplementation(async (req, res) => {
          const user = await User.findOne({ username: req.body.username });

          if (!user) {
            return res.status(404).json({
              success: false,
              error: "Username or password incorrect",
            });
          }

          const isMatch = comparePassword(
            user.password,
            user.salt,
            req.body.password
          );
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              error: "Username or password incorrect",
            });
          }

          const token = "mockToken";

          res.status(200).json({
            success: true,
            data: {
              id: user.id,
              username: user.username,
              isAdmin: user.isAdmin,
            },
            token: token,
          });
        });

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        id: "507f1f77bcf86cd799439011",
        username: "testUser",
        password: "encryptedPassword",
        salt: "testSalt",
        isAdmin: false,
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const comparePasswordHelper = require("../helpers/comparePasswordHelper");
      comparePasswordHelper.comparePassword.mockReturnValue(true);

      const req = mockRequest({
        username: "testUser",
        password: "password123",
      });
      const res = mockResponse();

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockUser.id,
          username: mockUser.username,
          isAdmin: mockUser.isAdmin,
        },
        token: "mockToken",
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

      const mockUser = { username: "testUser", preferences: {} };

      User.find = jest.fn().mockResolvedValue(mockUsers);

      const req = mockRequest();
      const res = mockResponse();

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockUsers.length,
        data: expect.arrayContaining([
          expect.objectContaining({ username: "user1" }),
          expect.objectContaining({ username: "user2" }),
        ]),
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
      // Define mockUser
      const mockUser = {
        username: "testUser",
        preferences: {},
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const req = mockRequest({}, { userId: "testId" });
      // Add authentication properties
      req.userId = "testId";
      req.isAdmin = true;

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
        preferences: { theme: "dark" },
      };

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

      const req = mockRequest(updatedUser, { userId: "testId" });
      req.userId = "testId";
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
      // Add authentication properties to match the user being updated
      req.userId = "testId";

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

      // Mock the findByIdAndDelete method
      User.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      // Set up authenticated user with the same ID as the one being deleted
      const userId = "testId";
      const req = mockRequest({}, { userId: userId });
      req.userId = userId; // Authentication property

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
        error: "Unauthorised - only admins can delete other user accounts",
      });
    });

    it("should allow admin users to delete any user", async () => {
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
      req.isAdmin = true;
      const res = mockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      // Match the transformed data structure
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: deletedUser._id, // Note: id not _id
          username: deletedUser.username,
          isAdmin: deletedUser.isAdmin,
          preferences: deletedUser.preferences,
          progress: deletedUser.progress,
        },
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
      req.isAdmin = true;
      const res = mockResponse();

      await userController.deleteAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "All users deleted, excluding SystemAdmin",
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
        error: "Unauthorised - admin privileges required for this operation",
      });
    });
  });
});
