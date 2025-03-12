const express = require("express");
const {
  getPuzzles,
  checkPuzzleAnswer,
} = require("../controllers/puzzleController");

const router = express.Router();

router.get("/", getPuzzles);
router.post("/check", checkPuzzleAnswer);

module.exports = router;
