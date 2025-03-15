const express = require("express");
const router = express.Router();
const progressionController = require("../controllers/progressionController");
const { checkAuthority } = require("../middleware/checkAuthority");

// All progression routes need authentication - users should only access their own progress
router.get(
  "/:userId",
  checkAuthority,
  progressionController.getUserProgress
);
router.post(
  "/quiz",
  checkAuthority,
  progressionController.updateQuizProgress
);
router.post(
  "/reading",
  checkAuthority,
  progressionController.updateReadingProgress
);

module.exports = router;
