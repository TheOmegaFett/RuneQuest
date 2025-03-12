/**
 * Updates one user record in the database, separate routes, separate data
 * @async
 * @function updateUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file and update confirmation
 */

exports.updateUser = async (req, res) => {
  try {
    // // Retrieve update data from the body
    const bodyData = {
        username: req.body.username,
        password: req.body.password,
        preferences: {
            theme: req.body.preferences.theme,
            notifications: req.body.preferences.notifications,
        },
        progress: {
            completedQuizzes: req.body.preferences.completedQuizzes,
            completedPuzzles: req.body.preferences.completedPuzzles,
            achievements: req.body.preferences.achievements,
        },
    };

    // CURRENT ISSUE - on update password is not encrypted, consider
    // middleware in conjuction with User model pre to keep code DRY,
    // another solution is a separate operation specifically for a
    // password update

    // CURRENT ISSUE - can not directly update progress, type issue is
    // suspected but maybe a dependency issue

    // Fetch and update user data using body
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
