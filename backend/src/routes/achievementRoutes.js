const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");

// Get all achievements
router.get("/", achievementController.getAllAchievements);

// Get achievement by ID
router.get("/:id", achievementController.getAchievementById);

// Create new achievement (admin only)
router.post("/", achievementController.createAchievement);

module.exports = router;
