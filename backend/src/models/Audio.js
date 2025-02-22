const mongoose = require("mongoose");

/**
 * Mongoose schema for Audio files
 * Manages audio recordings for rune pronunciations
 * @typedef {Object} Audio
 */
const AudioSchema = new mongoose.Schema(
  {
    // Descriptive name for the audio file
    name: {
      type: String,
      required: [true, "Audio name is required"],
    },
    // Storage location of the audio file
    url: {
      type: String,
      required: [true, "Audio URL is required"],
    },
    // Length of the audio in seconds
    duration: {
      type: Number,
      required: [true, "Audio duration is required"],
    },
    // Language of the audio recording
    language: {
      type: String,
      default: "Old Norse",
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("Audio", AudioSchema);
