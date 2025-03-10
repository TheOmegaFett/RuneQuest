const express = require("express");
const router = express.Router();
const readingController = require("../controllers/readingController");

// Create reading
router.post("/create/:userId", readingController.createReading);

// Get all readings
router.get("/readings", readingController.getAllReadings);

// Get readings for a specific user
router.get("/user/:userId", readingController.getReadingsForUser);

// Get reading by ID
router.get("/readings/:id", readingController.getReadingById);

// Update reading
router.put("/readings/:id", readingController.updateReading);

// Delete reading
router.delete("/readings/:id", readingController.deleteReading);

module.exports = router;
