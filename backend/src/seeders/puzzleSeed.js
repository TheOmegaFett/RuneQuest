const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Puzzle = require("../models/Puzzle");
const Rune = require("../models/Rune"); // Add this import for the Rune model

// Import word lists
const wordsList = require("./words_list.json");

/**
 * Converts English text to Elder Futhark runes using database
 * @param {string} text - English text to convert
 * @param {Object} runeMap - Map of characters to runes from database
 * @returns {string} - Rune representation
 */
function convertToRunes(text) {
  let runeText = "";
  // Convert to lowercase for consistent mapping
  text = text.toLowerCase();

  // Create a mapping for special characters
  const specialCharMap = {
    ð: "d",
    þ: "th",
    æ: "ae",
    ø: "o",
    å: "a",
  };

  for (let i = 0; i < text.length; i++) {
    // Check for special case digraphs like 'th'
    if (i < text.length - 1 && text[i] === "t" && text[i + 1] === "h") {
      runeText += runeMap["th"] || "";
      i++; // Skip next character
    } else {
      // Get rune for current character or empty if not found
      let char = text[i];

      // Replace special characters with their Latin equivalents
      if (specialCharMap[char]) {
        char = specialCharMap[char];
      }

      runeText += runeMap[char] || char; // Keep original if no mapping
    }
  }

  return runeText;
}
/**
 * Creates puzzle entries from words list
 * @param {Object} runeMap - Map of characters to runes from database
 * @returns {Array} - Array of puzzle objects
 */
function generatePuzzles(runeMap) {
  const puzzles = [];

  // Process Norse words
  wordsList.norse_words.forEach((wordObj) => {
    puzzles.push({
      englishWord: wordObj.word,
      runeEquivalent: convertToRunes(wordObj.word, runeMap),
      difficulty: getDifficulty(wordObj.word),
      category: "norse",
      hints: [wordObj.meaning],
    });
  });

  // Process elemental words
  wordsList.elemental_words.forEach((wordObj) => {
    puzzles.push({
      englishWord: wordObj.word,
      runeEquivalent: convertToRunes(wordObj.word, runeMap),
      difficulty: getDifficulty(wordObj.word),
      category: "elemental",
      hints: [wordObj.meaning],
    });
  });

  // Add remaining categories
  ["weapon_words", "armour_words"].forEach((category) => {
    wordsList[category].forEach((wordObj) => {
      puzzles.push({
        englishWord: wordObj.word,
        runeEquivalent: convertToRunes(wordObj.word, runeMap),
        difficulty: getDifficulty(wordObj.word),
        category: category.replace("_words", ""),
        hints: [wordObj.meaning],
      });
    });
  });

  return puzzles;
}

/**
 * Determines difficulty based on word length and complexity
 * @param {string} word - The word to analyze
 * @returns {string} - Difficulty level
 */
function getDifficulty(word) {
  const length = word.length;
  if (length <= 4) return "easy";
  if (length <= 7) return "medium";
  return "hard";
}

/**
 * Seeds the database with puzzle data
 */
async function seedPuzzles() {
  try {
    // Get rune mappings from database
    const runes = await Rune.find({});

    // Create a mapping object from the database results
    const runeMap = {};
    runes.forEach((rune) => {
      if (rune.englishEquivalent) {
        runeMap[rune.englishEquivalent.toLowerCase()] = rune.symbol;
      }
    });

    // Generate puzzles using the database-sourced rune map
    const puzzles = generatePuzzles(runeMap);

    // Clear existing puzzles
    await Puzzle.deleteMany({});

    // Insert new puzzles
    await Puzzle.insertMany(puzzles);

    console.log(`Successfully seeded ${puzzles.length} puzzles into database`);
  } catch (error) {
    console.error("Error seeding puzzle database:", error);
  }
}

module.exports = seedPuzzles;
