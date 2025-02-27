const { response } = require("express");
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
        const usersData = await User.find();
        
        // Return success response with user files and count
        res.status(200).json({
            success: true,
            count: usersData.length,
            data: usersData,
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
        // Fetch all user documents from database
        const userData = await User.findById(req.params.userId);
        
        // Return success response with user file
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
        // const bodyData = {
        //     username: req.body.username,
        //     password: req.body.password,
        //     preferences: {
        //         theme: req.body.preferences.theme,
        //         notifications: req.body.preferences.notifications,
        //     },
        //     progress: {
        //         completedQuizzes: req.body.preferences.completedQuizzes,
        //         completedPuzzles: req.body.preferences.completedPuzzles,
        //         achievements: req.body.preferences.achievements,
        //     },
        // };

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
        const userData = await User.findByIdAndDelete(req.params.userId);

        // Return success response with deleted data
        res.status(200).json({
            success: true,
            data: userData,
        })
    } catch (error) {
        // Return error response if deletion fails
        res.status(400).json({
          success: false,
          error: error.message,
        });
    }
};