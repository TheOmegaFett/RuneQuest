const RuneCategory = require("../models/RuneCategory");

/**
 * Creates a new rune category in the database
 * @async
 * @function createCategory
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing category data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created category data
 */
exports.createCategory = async (req, res) => {
  try {
    // Create new category document from request body
    const category = await RuneCategory.create(req.body);

    // Return success response with created category data
    res.status(201).json({
      success: true,
      data: category,
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
 * Retrieves all rune categories from the database
 * @async
 * @function getCategories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of categories and count
 */
exports.getCategories = async (req, res) => {
  try {
    // Fetch all category documents from database
    const categories = await RuneCategory.find();

    // Return success response with categories and count
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    // Return error response if retrieval fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
