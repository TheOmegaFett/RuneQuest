const express = require("express");
const router = express.Router();
const readingController = require("../controllers/readingController");
const { checkAuthority } = require("../middleware/checkAuthority");

// Protected routes - require authentication
router.post("/create/:userId", checkAuthority, readingController.createReading);
router.get(
  "/user/:userId",
  checkAuthority,
  readingController.getReadingsForUser
);
router.put("/readings/:id", checkAuthority, readingController.updateReading);
router.delete("/readings/:id", checkAuthority, readingController.deleteReading);

// Public routes - general reading content can be publicly viewable
router.get("/readings", readingController.getAllReadings);
router.get("/readings/:id", readingController.getReadingById);

module.exports = router;
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
