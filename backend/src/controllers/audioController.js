const Audio = require("../models/Audio");

/**
 * Creates a new audio record in the database
 * @async
 * @function createAudio
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing audio data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created audio data
 */
exports.createAudio = async (req, res) => {
  try {
    // Create new audio document from request body
    const audio = await Audio.create(req.body);

    // Return success response with created audio data
    res.status(201).json({
      success: true,
      data: audio,
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
 * Retrieves all audio records from the database
 * @async
 * @function getAllAudio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with array of audio files and count
 */
exports.getAllAudio = async (req, res) => {
  try {
    // Fetch all audio documents from database
    const audioFiles = await Audio.find();

    // Return success response with audio files and count
    res.status(200).json({
      success: true,
      count: audioFiles.length,
      data: audioFiles,
    });
  } catch (error) {
    // Return error response if retrieval fails
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
