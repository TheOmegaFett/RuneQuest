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
function convertToRunes(text, runeMap) {
  let runeText = "";
  // Convert to lowercase for consistent mapping
  text = text.toLowerCase();

  // Create a mapping for special characters (all uppercase)
  const specialCharMap = {
    ð: "D",
    þ: "TH",
    æ: "AE",
    ø: "O",
    å: "A",
    ö: "O",
    ü: "U",
    ä: "A",
    é: "E",
    á: "A",
    í: "I",
    ó: "O",
    ú: "U",
  };

  for (let i = 0; i < text.length; i++) {
    // Check for special case digraphs like 'th'
    if (i < text.length - 1 && text[i] === "t" && text[i + 1] === "h") {
      runeText += runeMap["th"] || "TH"; // Fallback to uppercase TH
      i++; // Skip next character
    } else {
      // Get rune for current character or empty if not found
      let char = text[i];

      // Replace special characters with their uppercase Latin equivalents
      if (specialCharMap[char]) {
        char = specialCharMap[char];
      } else {
        // Convert regular characters to uppercase
        char = char.toUpperCase();
      }

      // Use lowercase for runeMap lookup, but uppercase for fallback
      runeText += runeMap[char.toLowerCase()] || char.toUpperCase();
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
    // Normalize the English word for storage
    const normalizedWord = normalizeWord(wordObj.word);

    puzzles.push({
      englishWord: normalizedWord, // Store the normalized version
      runeEquivalent: convertToRunes(wordObj.word, runeMap),
      difficulty: getDifficulty(wordObj.word),
      category: "norse",
      hints: [wordObj.meaning],
    });
  });

  // Process elemental words
  wordsList.elemental_words.forEach((wordObj) => {
    const normalizedWord = normalizeWord(wordObj.word);
    puzzles.push({
      englishWord: normalizedWord,
      runeEquivalent: convertToRunes(wordObj.word, runeMap),
      difficulty: getDifficulty(wordObj.word),
      category: "elemental",
      hints: [wordObj.meaning],
    });
  });

  // Add remaining categories
  ["weapon_words", "armour_words"].forEach((category) => {
    wordsList[category].forEach((wordObj) => {
      const normalizedWord = normalizeWord(wordObj.word);
      puzzles.push({
        englishWord: normalizedWord,
        runeEquivalent: convertToRunes(wordObj.word, runeMap),
        difficulty: getDifficulty(wordObj.word),
        category: category.replace("_words", ""),
        hints: [wordObj.meaning],
      });
    });
  });

  return puzzles;
}

// Helper function to normalize words
function normalizeWord(text) {
  // Create a mapping for special characters (same as in convertToRunes)
  const specialCharMap = {
    ð: "D",
    þ: "TH",
    æ: "AE",
    ø: "O",
    å: "A",
    ö: "O",
    ü: "U",
    ä: "A",
    é: "E",
    á: "A",
    í: "I",
    ó: "O",
    ú: "U",
  };

  // Replace special characters and convert to desired case
  return text
    .split("")
    .map((char) => {
      if (specialCharMap[char.toLowerCase()]) {
        return specialCharMap[char.toLowerCase()];
      }
      return char; // Keep original case for regular characters
    })
    .join("");
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
