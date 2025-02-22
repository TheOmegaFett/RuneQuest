const seedElderFuthark = require("../seeders/elderFutharkSeeder");

const initializeDatabase = async () => {
  try {
    await seedElderFuthark();
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

module.exports = initializeDatabase;
