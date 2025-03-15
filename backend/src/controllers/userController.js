const User = require("../models/User");
const UserProgression = require("../models/UserProgression");
const { filterUserData } = require("../helpers/filterDataHelper");
const { encryptPassword } = require("../helpers/encryptPasswordHelper");
const { comparePassword } = require("../helpers/comparePasswordHelper");
const { checkAndUnlockAchievements } = require("../helpers/achievementHelper");
const { createToken } = require("../helpers/createTokenHelper");

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
    const token = createToken(user._id);

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
          id: user.id,
          username: user.username,
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
 /**
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

    // Check user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Username or password incorrect",
      });
    }

    // Check if the password matches
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

    // Create user token
    const token = createToken(user._id);

    // Update login streak
    await updateLoginStreak(user._id);

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
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
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
 * Updates a user's login streak when they successfully log in
 * @async
 * @function updateLoginStreak
 * @param {String} userId - The user's ID
 */
async function updateLoginStreak(userId) {
  try {
    // Find or create user progression
    let userProgress = await UserProgression.findOne({ user: userId });

    if (!userProgress) {
      userProgress = new UserProgression({
        user: userId,
        quizzes: [],
        readings: [],
        puzzles: [],
        achievements: [],
        stats: {
          totalPoints: 0,
          quizStreak: 0,
          loginStreak: 1, // First login sets streak to 1
          lastActive: new Date(),
          runesLearned: 0,
        },
      });
    } else {
      const lastActiveDate = new Date(userProgress.stats.lastActive);
      const currentDate = new Date();

      // Calculate days between logins
      // Reset hours/minutes/seconds to compare calendar days properly
      const lastActiveDay = new Date(lastActiveDate.setHours(0, 0, 0, 0));
      const currentDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const dayDifference = Math.floor(
        (currentDay - lastActiveDay) / (1000 * 60 * 60 * 24)
      );

      // Initialize loginStreak if it doesn't exist
      if (userProgress.stats.loginStreak === undefined) {
        userProgress.stats.loginStreak = 0;
      }

      if (dayDifference === 1) {
        // Consecutive day login - increment streak
        userProgress.stats.loginStreak += 1;
      } else if (dayDifference === 0) {
        // Same day login - maintain streak
        // No change to streak
      } else {
        // Non-consecutive login - reset streak
        userProgress.stats.loginStreak = 1;
      }

      // Update last active timestamp
      userProgress.stats.lastActive = new Date();
    }

    await userProgress.save();

    // Check for streak achievements
    checkAndUnlockAchievements(userId, {}, "login");
  } catch (error) {
    console.error("Error updating login streak:", error);
  }
}

/** * Retrieves all user records from the database // MAY REMOVE LATER
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

    const userData = [];

    // Display all nonsensitve data for admins, only usernames for others
    if (req.isAdmin) {
      users.forEach((user) => {
        userData.push(filterUserData(user));
      });
    } else {
      users.forEach((user) => {
        userData.push({
          username: user.username,
        });
      });
    }

    // Return success response with user files and count for standard users
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

    // Check user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (req.isAdmin) {
      userData = filterUserData(user);
    } else if (req.userId == req.params.userId) {
      userData = {
        username: user.username,
        preferences: user.preferences,
        progress: user.progress,
      };
    } else {
      userData = {
        username: user.username,
      };
    }

    // Return success response with user data
    res.status(200).json({
      success: true,
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
 * Updates one user record in the database
 * @async
 * @function updateUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file and update confirmation
 */

exports.updateUserSettings = async (req, res) => {
  try {
    // Check if user is trying to delete someone else's account
    if (req.userId !== req.params.userId) {
      // If IDs don't match, check if user is an admin
      if (!req.isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Unauthorised - only admins can update other user accounts",
        });
      }
    }

    // Retrieve update data from the body
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

    // Check user exists
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
    if (!req.isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Unauthorised - admin privileges required for this operation",
      });
    }

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
    // Check if user is trying to delete someone else's account
    if (req.userId !== req.params.userId) {
      // If IDs don't match, check if user is an admin
      if (!req.isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Unauthorised - only admins can delete other user accounts",
        });
      }
    }

    // Authorized to delete - proceed with deletion
    const user = await User.findByIdAndDelete(req.params.userId);

    // Check user exists
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
        error: "Unauthorised - admin privileges required for this operation",
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
