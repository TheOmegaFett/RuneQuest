/**
 * Main application entry point for RuneQuest server
 * Initializes Express application, database connection, and API routes
 * @module index
 */

const express = require("express");
const { connectDB } = require("./config/db");
const mainRouter = require("./routes/mainRouter");
const initializeDatabase = require("./config/initDB");
const { logger } = require("./middleware/logger");

// Connect to MongoDB
connectDB();

// Initialize database with seed data
initializeDatabase();

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();

/**
 * Server port - uses environment variable or 3000 as fallback
 * @type {number}
 */
const PORT = process.env.PORT || 3000;

// Configure middleware for request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger)

// Register main API router
app.use("/api", mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`RuneQuest server listening on port ${PORT}`);
});
