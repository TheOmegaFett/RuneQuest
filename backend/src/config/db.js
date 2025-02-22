const mongoose = require("mongoose");
const dotenv = require("dotenv")

/**
 * Establishes connection to MongoDB database for RuneQuest application
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails, exits process with status code 1
 */

// Configure dotenv
dotenv.config()

const connectDB = async () => {
  const dbURL = process.env.DATABASE_URL || "mongodb://localhost:27017/runequest"
  try {
    // Attempt to connect to local MongoDB instance with specified database name
    const conn = await mongoose.connect(dbURL, {
      // Configuration options for MongoDB connection
      // useNewUrlParser: true, // Use new URL string parser THIS IS DEPRECATED
      // useUnifiedTopology: true, // Use new Server Discovery and Monitoring engine THIS IS DEPRECATED
    });

    // Log successful connection with host information
    console.log(`MongoDB Connected: ${conn.connection.host} => ${dbURL}`);
  } catch (error) {
    // Log any connection errors and terminate process
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.close()
}

// Export the connection function for use in other modules
module.exports = {
  connectDB,
  disconnectDB
}
