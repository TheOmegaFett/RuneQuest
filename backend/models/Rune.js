const mongoose = require("mongoose");

/**
 * Mongoose schema for Runes
 * Represents individual runes with their properties, relationships, and audio associations
 * @typedef {Object} Rune
 */
const RuneSchema = new mongoose.Schema(
  {
    // Unique name identifier for the rune
    name: {
      type: String,
      required: [true, "Rune name is required"],
      unique: true,
    },
    // Interpretation and significance of the rune
    meaning: {
      type: String,
      required: [true, "Rune meaning is required"],
    },
    // Visual representation of the rune character
    symbol: {
      type: String,
      required: [true, "Rune symbol is required"],
      unique: true,
    },
    // Guide for correct pronunciation
    pronunciation: {
      type: String,
      required: [true, "Pronunciation is required"],
    },
    // Historical background and cultural context
    history: {
      type: String,
      required: [true, "Historical context is required"],
    },
    // Reference to the rune's category (e.g., Elder Futhark)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RuneCategory",
      required: [true, "Rune category is required"],
    },
    // Array of connections to other runes with relationship types
    relationships: [
      {
        rune: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Rune",
        },
        relationshipType: String,
      },
    ],
    // Reference to pronunciation audio file
    audioFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audio",
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("Rune", RuneSchema);
