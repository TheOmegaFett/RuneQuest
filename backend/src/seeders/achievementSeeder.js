const mongoose = require("mongoose");
const Achievement = require("../models/Achievement");
const config = require("../config/config"); // Assuming you have a config file for DB connection

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Achievement data
const achievements = [
  // Quiz-related achievements
  {
    name: "Rune Novice",
    description: "Complete your first quiz",
    category: "quiz",
    icon: "novice-badge.svg",
    requirement: { type: "quiz_completed", count: 1 },
    points: 10,
  },
  {
    name: "Rune Apprentice",
    description: "Complete 10 quizzes of any difficulty",
    category: "quiz",
    icon: "apprentice-badge.svg",
    requirement: { type: "quiz_completed", count: 10 },
    points: 25,
  },
  {
    name: "Rune Scholar",
    description: "Complete 5 hard quizzes with perfect scores",
    category: "quiz",
    icon: "scholar-badge.svg",
    requirement: {
      type: "quiz_completed",
      count: 5,
      difficulty: "hard",
      perfectScore: true,
    },
    points: 50,
  },

  // Reading-related achievements
  {
    name: "Curious Mind",
    description: "Read your first rune cast",
    category: "reading",
    icon: "curious-badge.svg",
    requirement: { type: "reading_completed", count: 1 },
    points: 10,
  },
  {
    name: "Rune Historian",
    description: "Complete 10 readings",
    category: "reading",
    icon: "historian-badge.svg",
    requirement: { type: "reading_completed", count: 10 },
    points: 30,
  },

  // Puzzle-related achievements
  {
    name: "Puzzle Solver",
    description: "Complete your first puzzle",
    category: "puzzle",
    icon: "puzzle-badge.svg",
    requirement: { type: "puzzle_completed", count: 1 },
    points: 15,
  },
  {
    name: "Puzzle Master",
    description: "Complete 10 puzzles",
    category: "puzzle",
    icon: "master-badge.svg",
    requirement: { type: "puzzle_completed", count: 10 },
    points: 35,
  },

  // Streak achievements
  {
    name: "Dedicated Student",
    description: "Achieve a 7-day streak",
    category: "general",
    icon: "streak-badge.svg",
    requirement: { type: "streak", days: 7 },
    points: 20,
  },
  {
    name: "Rune Devotee",
    description: "Achieve a 30-day streak",
    category: "general",
    icon: "devotee-badge.svg",
    requirement: { type: "streak", days: 30 },
    points: 100,
  },

  // Collection achievements
  {
    name: "Elder Futhark Collector",
    description: "Learn all runes from the Elder Futhark set",
    category: "general",
    icon: "elder-futhark-badge.svg",
    requirement: {
      type: "runes_learned",
      category: "elder-futhark",
      count: 24,
    },
    points: 75,
  },
  {
    name: "Younger Futhark Collector",
    description: "Learn all runes from the Younger Futhark set",
    category: "general",
    icon: "younger-futhark-badge.svg",
    requirement: {
      type: "runes_learned",
      category: "younger-futhark",
      count: 16,
    },
    points: 75,
  },
  {
    name: "Anglo-Saxon Collector",
    description: "Learn all runes from the Anglo-Saxon set",
    category: "general",
    icon: "anglo-saxon-badge.svg",
    requirement: { type: "runes_learned", category: "anglo-saxon", count: 33 },
    points: 75,
  },
];

// Function to seed achievements
const seedAchievements = async () => {
  try {
    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log("Existing achievements cleared");

    // Insert new achievements
    const createdAchievements = await Achievement.insertMany(achievements);
    console.log(`${createdAchievements.length} achievements inserted`);

    return createdAchievements;
  } catch (error) {
    console.error(`Error seeding achievements: ${error.message}`);
    throw error;
  }
};

// Run the seeder
const runSeeder = async () => {
  try {
    const conn = await connectDB();
    await seedAchievements();
    console.log("Achievement seeding completed successfully");
    await mongoose.connection.close();
  } catch (error) {
    console.error(`Failed to seed achievements: ${error.message}`);
    process.exit(1);
  }
};

// Check if script is run directly (not imported)
if (require.main === module) {
  runSeeder();
}

module.exports = { seedAchievements };
