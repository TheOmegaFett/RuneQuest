const Divination = require("../models/Divination");
const Rune = require("../models/Rune");

const selectRandomRune = async () => {
  const [rune] = await Rune.aggregate([{ $sample: { size: 1 } }]);
  return rune;
};

const interpretRune = (rune) => {
  return {
    rune: rune.name,
    meaning: rune.meaning,
    interpretation: rune.history,
  };
};

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
      // Validate required fields first
      const { userId, runes, interpretation, spread } = req.body;
      if (!userId || !runes || !interpretation) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const reading = await Divination.create({
        userId,
        runes,
        interpretation,
        spread,
        date: new Date(),
      });

      res.status(201).json(reading);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  // Get user's reading history
  async getReadingHistory(req, res) {
    try {
      const { userId } = req.params;
      // Authorization check - allow access to own data
      // req.userId comes from the token via the checkAuthority middleware
      if (req.userId !== userId) {
        // Make sure IDs are compared as strings to avoid object reference issues
        if (String(req.userId) !== String(userId)) {
          // Optional: Check if requesting user is an admin
          const User = require("../models/User");
          const user = await User.findById(req.userId);

          if (!user || !user.isAdmin) {
            return res.status(403).json({
              success: false,
              message: "Not authorized to access this history",
            });
          }
        }
      }
      const readings = await Divination.find({ userId }).sort({ date: -1 });

      // Handle case where no readings exist yet
      if (!readings) {
        return res.status(200).json([]);
      }

      return res.status(200).json(readings);
    } catch (error) {
      console.error("Error retrieving reading history:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = {
  ...divinationController,
  selectMultipleRunes,
  interpretSpread,
};
