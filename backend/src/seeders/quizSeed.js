const mongoose = require("mongoose");
const QuizQuestion = require("../models/QuizQuestion");
const runeMap = require("./runes.json");

function generateQuizQuestions() {
  const quizQuestions = [];

  // Get all runes and their meanings
  const runeEntries = Object.entries(runeMap);

  runeEntries.forEach(([letter, rune]) => {
    // Skip entries that aren't actual runes (like digraphs)
    if (letter.length > 1 && !["th", "ng", "ea", "st"].includes(letter)) return;

    // Create basic meaning if not explicitly defined
    const meaningKey = `${letter}_meaning`;
    const meaning = runeMap[meaningKey] || `Represents the sound "${letter}"`;

    // Get other meanings to use as incorrect options
    const otherMeanings = runeEntries
      .filter(([key]) => key.endsWith("_meaning") && key !== meaningKey)
      .map(([_, value]) => value)
      .filter(Boolean);

    // Shuffle and take a subset for incorrect answers
    const shuffledMeanings = otherMeanings.sort(() => 0.5 - Math.random());

    // Create an easy question (2 choices)
    quizQuestions.push({
      rune,
      correctMeaning: meaning,
      incorrectMeanings: [shuffledMeanings[0]],
      difficulty: "easy",
      category: "elder-futhark",
    });

    // Create a medium question (3 choices)
    quizQuestions.push({
      rune,
      correctMeaning: meaning,
      incorrectMeanings: [shuffledMeanings[0], shuffledMeanings[1]],
      difficulty: "medium",
      category: "elder-futhark",
    });

    // Create a hard question (4 choices)
    quizQuestions.push({
      rune,
      correctMeaning: meaning,
      incorrectMeanings: [
        shuffledMeanings[0],
        shuffledMeanings[1],
        shuffledMeanings[2],
      ],
      difficulty: "hard",
      category: "elder-futhark",
    });
  });

  return quizQuestions;
}

async function seedQuizQuestions() {
  try {
    // Generate quiz questions
    const questions = generateQuizQuestions();

    // Clear existing questions
    await QuizQuestion.deleteMany({});

    // Insert new questions
    await QuizQuestion.insertMany(questions);

    console.log(
      `Successfully seeded ${questions.length} quiz questions into database`
    );
  } catch (error) {
    console.error("Error seeding quiz questions:", error);
  }
}

module.exports = seedQuizQuestions;
