const User = require("../models/User");
const { encryptPassword } = require("../middleware/encryptPassword");

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

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      bodyData,
      { new: true }
    );

    // Return success response with user file
    res.status(200).json({
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


exports.updateUserProgress = async (req, res) => {
  try {
    // // Retrieve update data from the body
    const bodyData = {
      progress: {
        completedQuizzes: req.body.preferences.completedQuizzes,
        completedPuzzles: req.body.preferences.completedPuzzles,
        achievements: req.body.preferences.achievements,
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );

    // Return success response with user file
    res.status(200).json({
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};