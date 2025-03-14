/**
 * Database initialization module
 * Handles seeding of all required data in the correct order
 * to maintain data integrity and dependencies
 * @module config/initDB
 */

const seedElderFuthark = require("../seeders/elderFutharkSeeder");
const seedPuzzles = require("../seeders/puzzleSeed");
const seedQuizQuestions = require("../seeders/quizSeed");
const { seedAchievements } = require("../seeders/achievementSeeder");
const seedDefaultAdmin = require("../seeders/adminSeeder");

/**
 * Initializes the database with seed data in the appropriate order
 * Ensures dependent data is seeded after its prerequisites
 *
 * Order of operations:
 * 1. Elder Futhark runes (foundation data)
 * 2. Puzzles (depends on rune data)
 * 3. Quiz questions (depends on rune data)
 * 4. Achievements (depends on all previous data)
 *
 * @async
 * @returns {Promise<void>} Resolves when all seeding is complete
 */
const initializeDatabase = async () => {
  try {
    // Seed elder futhark runes first (as they might be referenced by other modules)
    await seedElderFuthark();

    // Seed puzzles after runes are available
    await seedPuzzles();

    // Seed quiz questions (also depends on rune data)
    await seedQuizQuestions();

    // Seed achievements (depends on understanding of all available content)
    await seedAchievements();

    // Seed default admin
    await seedDefaultAdmin();

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

module.exports = initializeDatabase;
