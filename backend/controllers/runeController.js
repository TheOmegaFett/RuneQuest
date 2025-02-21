const Rune = require("../models/Rune");

/**
 * Creates a new rune in the database with populated relationships
 * @async
 * @function addRune
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing rune data
 * @param {string} req.body.name - Name of the rune
 * @param {string} req.body.meaning - Meaning of the rune
 * @param {string} req.body.symbol - Symbol representation
 * @param {string} req.body.pronunciation - How to pronounce the rune
 * @param {string} req.body.history - Historical background
 * @param {ObjectId} req.body.category - Reference to category
 * @param {Array} req.body.relationships - Related runes
 * @param {ObjectId} req.body.audioFile - Reference to audio file
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with populated rune data
 */
exports.addRune = async (req, res) => {
  try {
    // Destructure required fields from request body
    const {
      name,
      meaning,
      symbol,
      pronunciation,
      history,
      category,
      relationships,
      audioFile,
    } = req.body;

    // Create new rune document
    const rune = await Rune.create({
      name,
      meaning,
      symbol,
      pronunciation,
      history,
      category,
      relationships,
      audioFile,
    });

    // Fetch created rune with populated references
    const populatedRune = await Rune.findById(rune._id)
      .populate("category", "name")
      .populate("relationships.rune", "name symbol")
      .populate("audioFile", "url");

    // Return success response with populated rune data
    res.status(201).json({
      success: true,
      data: populatedRune,
      message: "Rune successfully created",
    });
  } catch (error) {
    // Handle duplicate key errors (name or symbol already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Rune with this name or symbol already exists",
      });
    }
    // Handle other errors
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Retrieves all runes from database with populated relationships
 * @async
 * @function getAllRunes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of populated runes and count
 */
exports.getAllRunes = async (req, res) => {
  try {
    // Fetch all runes with populated references
    const runes = await Rune.find()
      .populate("category", "name")
      .populate("relationships.rune", "name symbol")
      .populate("audioFile", "url");

    // Return success response with runes and count
    res.status(200).json({
      success: true,
      count: runes.length,
      data: runes,
    });
  } catch (error) {
    // Handle any errors during retrieval
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Deletes a specific rune by ID
 * @async
 * @function deleteRune
 * @param {Object} req - Express request object
 * @param {string} req.params.id - ID of rune to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deleted rune data
 */
exports.deleteRune = async (req, res) => {
  try {
    // Attempt to find and delete rune by ID
    const rune = await Rune.findByIdAndDelete(req.params.id);

    // Handle case where rune is not found
    if (!rune) {
      return res.status(404).json({
        success: false,
        error: "Rune not found",
      });
    }

    // Return success response with deleted rune data
    res.status(200).json({
      success: true,
      message: "Rune successfully deleted",
      data: rune,
    });
  } catch (error) {
    // Handle any errors during deletion
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
