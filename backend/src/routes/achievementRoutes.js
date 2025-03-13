const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");
const { checkAuthority } = require("../middleware/checkAuthority");

// Public routes - achievements can be viewable by anyone
router.get("/", achievementController.getAllAchievements);
router.get("/:id", achievementController.getAchievementById);

// Add an admin check middleware
const checkAdmin = async (req, res, next) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Admin privileges required for this operation",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Apply both authentication and admin check to the creation route
router.post(
  "/",
  checkAuthority,
  checkAdmin,
  achievementController.createAchievement
);

module.exports = router;
