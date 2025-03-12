const seedElderFuthark = require("../seeders/elderFutharkSeeder");
const seedPuzzles = require("../seeders/puzzleSeed");

const initializeDatabase = async () => {
  try {
    // Seed elder futhark runes first (as they might be referenced by puzzles)
    await seedElderFuthark();

    // Seed puzzles after runes are available
    await seedPuzzles();

    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

module.exports = initializeDatabase;
