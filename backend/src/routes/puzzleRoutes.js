const express = require("express");
const router = express.Router();
const {
  getPuzzles,
  checkPuzzleAnswer,
  completePuzzle,
} = require("../controllers/puzzleController");
const { checkAuthority } = require("../middleware/checkAuthority");

router.get("/", getPuzzles);
router.post("/check", checkPuzzleAnswer);
router.post("/complete", checkAuthority, completePuzzle);

module.exports = router;
