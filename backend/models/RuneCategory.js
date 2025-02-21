const mongoose = require("mongoose");

/**
 * Mongoose schema for Rune Categories
 * Defines the structure for different types of runes (e.g., Elder Futhark, Younger Futhark)
 * @typedef {Object} RuneCategory
 */
const RuneCategorySchema = new mongoose.Schema(
  {
    // Unique identifier name for the category
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    // Detailed description of the rune category
    description: {
      type: String,
      required: [true, "Category description is required"],
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("RuneCategory", RuneCategorySchema);
