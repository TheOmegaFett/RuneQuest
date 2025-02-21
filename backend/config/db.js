const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB database for RuneQuest application
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails, exits process with status code 1
 */
const connectDB = async () => {
  try {
    // Attempt to connect to local MongoDB instance with specified database name
    const conn = await mongoose.connect("mongodb://localhost:27017/runequest", {
      // Configuration options for MongoDB connection
      useNewUrlParser: true, // Use new URL string parser
      useUnifiedTopology: true, // Use new Server Discovery and Monitoring engine
    });

    // Log successful connection with host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any connection errors and terminate process
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the connection function for use in other modules
module.exports = connectDB;
