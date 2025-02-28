const Divination = require("../models/Divination");
const Rune = require("../models/Rune");

const selectMultipleRunes = async (count) => {
  const runes = await Rune.aggregate([{ $sample: { size: count } }]);
  return runes;
};

const interpretSpread = (runes) => {
  const runeIds = runes.map((rune) => rune._id.toString());

  return runes.map((rune, index) => {
    // Filter relationships to only include those with other runes in this spread
    const relevantRelationships = rune.relationships.filter((rel) =>
      runeIds.includes(rel.rune.toString())
    );

    return {
      position: index + 1,
      rune: rune.name,
      meaning: rune.meaning,
      interpretation: rune.history,
      relationships: relevantRelationships,
    };
  });
};
const divinationController = {
  // Generate single rune reading
  async getSingleRuneReading(req, res) {
    try {
      // Logic for selecting and interpreting a single rune
      const rune = await selectRandomRune();
      const interpretation = interpretRune(rune);

      res.status(200).json({ rune, interpretation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Generate three rune spread
  async getThreeRuneSpread(req, res) {
    try {
      // Logic for selecting and interpreting three runes
      const runes = await selectMultipleRunes(3);
      const interpretation = interpretSpread(runes);

      res.status(200).json({ runes, interpretation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Generate five rune spread
  async getFiveRuneSpread(req, res) {
    try {
      // Logic for selecting and interpreting five runes
      const runes = await selectMultipleRunes(5);
      const interpretation = interpretSpread(runes);

      res.status(200).json({ runes, interpretation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Save a reading
  async saveReading(req, res) {
    try {
      const reading = await Reading.create(req.body);
      res.status(201).json(reading);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get user's reading history
  async getReadingHistory(req, res) {
    try {
      const { userId } = req.params;
      const readings = await Reading.find({ userId }).sort({ date: -1 });
      res.status(200).json(readings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = divinationController;
