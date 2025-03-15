const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const User = require("../models/User");
const { filterUserData } = require("../functions/filterUserData")
const { encryptPassword } = require("../functions/encryptPassword");
const { comparePassword } = require("../functions/comparePassword");

/**
 * Creates a new user record in the database
 * @async
 * @function registerUser
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created user data
 */

exports.registerUser = async (req, res) => {
  try {
    // Create new user document from request body
    const saltPass = encryptPassword(req.body.password);

    const bodyData = {
      username: req.body.username,
      password: saltPass["password"],
      salt: saltPass["salt"],
    };

    // REGISTRATION WILL ONLY ACCEPT USERNAME AND PASSWORD

    const user = await User.create(bodyData);

    // Create user token
    const token = jwt.sign({ id: user._id }, "secret");

    if (token.error) {
      // If token creation produces an error, respond with 409
      res.status(409).json({
        success: false,
        error: error.message,
      });
    } else {
      // Return success response with created user data
      res.status(201).json({
        success: true,
        data: {
          id: userData.id,
          username: userData.username,
        },
        token: token,
      });
    }
  } catch (error) {
    // Return error response if creation fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Logs in a user from the database, creating a token
 * @async
 * @function loginUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file and token
 */

exports.loginUser = async (req, res) => {
  try {
    // Fetch one user document from database by username
    const user = await User.findOne({ username: req.body.username });

    // Check the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Username or password incorrect",
      });
    }

    // Check if the password matches
    const isMatch = await comparePassword(
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

    // Create user token
    const token = jwt.sign({ id: user._id }, "secret");

    if (token.error) {
      // If token creation produces an error, respond with 409
      res.status(409).json({
        success: false,
        error: error.message,
      });
    } else {
      // Return success response with user file
      res.status(200).json({
        success: true,
        data: {
          id: userData.id,
          username: userData.username,
          isAdmin: userData.isAdmin,
        },
        token: token,
      });
    }
  } catch (error) {
    // Return error response if retrieval fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Retrieves all user records from the database // MAY REMOVE LATER
 * @async
 * @function getAllUsers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of user files and count
 */

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all user documents from database
    const users = await User.find();

    userData = [];
    users.forEach(user => {
      displayData.push(
        filterUserData(user),
      );
    });

    // Return success response with user files and count
    res.status(200).json({
      success: true,
      count: users.length,
      data: userData,
    });
  } catch (error) {
    // Return error response if retrieval fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Retrieves one user record from the database
 * @async
 * @function getOneUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file
 */

exports.getOneUser = async (req, res) => {
  try {
    // Fetch one user documents from database by id
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Return success response with user file and token
    res.status(200).json({
      success: true,
      data: filterUserData(user),
    });
  } catch (error) {
    // Return error response if retrieval fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Updates one user record in the database
 * @async
 * @function updateUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file and update confirmation
 */

exports.updateUserSettings = async (req, res) => {
  try {
    // // Retrieve update data from the body
    const saltPass = encryptPassword(req.body.password);

    const bodyData = {
      username: req.body.username,
      password: saltPass["password"],
      salt: saltPass["salt"],
      preferences: {
        theme: req.body.preferences.theme,
        notifications: req.body.preferences.notifications,
      },
    };

    const user = await User.findByIdAndUpdate(req.params.userId, bodyData, {
      new: true,
    });

    // Return success response with user file and token
    res.status(200).json({
      success: true,
      data: filterUserData(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Updates one user record in the database, changing the user into an admin
 * @async
 * @function updateUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of username and update confirmation
 */

exports.updateUserToAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: filterUserData(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Deletes one user record from the database
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file and delete confirmation
 */

exports.deleteUser = async (req, res) => {
  try {
    // Get the authenticated user ID from the middleware
    const authenticatedUserId = req.userId;
    const requestedUserId = req.params.userId;

    // Check if user is trying to delete someone else's account
    if (authenticatedUserId !== requestedUserId) {
      // If IDs don't match, check if user is an admin
      const authenticatedUser = await User.findById(authenticatedUserId);

      if (!authenticatedUser || !authenticatedUser.isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to delete other user accounts",
        });
      }
    }

    // Authorized to delete - proceed with deletion
    const user = await User.findByIdAndDelete(requestedUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Return success response with deleted data
    res.status(200).json({
      success: true,
      data: filterUserData(user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Deletes all user records from the database
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of deletion confirmation
 */

exports.deleteAllUsers = async (req, res) => {
  try {
    // Get the authenticated user
    const authenticatedUser = await User.findById(req.userId);

    // Check if user is an admin
    if (!authenticatedUser || !authenticatedUser.isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Admin privileges required for this operation",
      });
    }

    // Proceed with deletion if admin
    await User.deleteMany({ username: { $ne: "SystemAdmin" } });

    res.status(200).json({
      success: true,
      message: "All users deleted, excluding SystemAdmin",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
