const Rune = require("../models/Rune");

exports.createRune = async (req, res) => {
  try {
    const rune = await Rune.create({
      name: req.body.name,
      meaning: req.body.meaning,
      symbol: req.body.symbol,
      pronunciation: req.body.pronunciation,
      history: req.body.history,
      category: req.body.categoryId,
      audioId: req.body.audioId,
    });

    res.status(201).json({
      success: true,
      data: rune,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
