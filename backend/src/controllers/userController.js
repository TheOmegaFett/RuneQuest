const jwt = require("jsonwebtoken")
const User = require("../models/User");
const { encryptPassword } = require("../functions/encryptPassword");


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
    const token = jwt.sign({ id: user._id }, "secret")

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
        data: user,
        token: token
      });
    };
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
    // Fetch one user documents from database by username
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Username or password incorrect",
      });
    }

    // Create user token
    const token = jwt.sign({ id: user._id }, "secret")

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
        userId: user._id,
        token: token
      });
    };
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

    // Return success response with user files and count
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
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

    // Return success response with user file
    res.status(200).json({
      success: true,
      data: user,
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
* Updates one user record in the database, separate routes, separate data
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

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      bodyData,
      { new: true }
    );

    // Return success response with user file
    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


// exports.updateUserProgress = async (req, res) => {
//   try {
//     // // Retrieve update data from the body
//     const bodyData = {
//       progress: {
//         completedQuizzes: req.body.preferences.completedQuizzes,
//         completedPuzzles: req.body.preferences.completedPuzzles,
//         achievements: req.body.preferences.achievements,
//       }
//     };

//     const user = await User.findByIdAndUpdate(
//       req.params.userId,
//       bodyData,
//       { new: true }
//     );

//     // Return success response with user file
//     res.status(200).json({
//       success: true,
//       data: user,
//     });

//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };


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
    // Fetch and delete user data
    const user = await User.findByIdAndDelete(req.params.userId);

    // Return success response with deleted data
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    // Return error response if deletion fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany()

    res.status(200).json({
      success: true,
      message: "All users deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};