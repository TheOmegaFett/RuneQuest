const User = require("../models/User");

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
        const user = await User.create(req.body);

        // Return success response with created user data
        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        // Return error response if creation fails
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};



/**
 * Retrieves all user records from the database
 * @async
 * @function getAllUsers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of user files and count
 */





/**
 * Retrieves one user record from the database
 * @async
 * @function getOneUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file
 */




/**
 * Deltetes one user record from the database
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response of user file and delete confirmation
 */