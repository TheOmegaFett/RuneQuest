const mongoose = require("mongoose");
const RuneCategory = require("../models/RuneCategory");
const Rune = require("../models/Rune");

const elderFutharkData = {
  category: {
    name: "Elder Futhark",

    description:
      "The oldest form of runic writing, used in Germanic languages from the 2nd to 8th centuries CE.",
  },
  runes: [
    // Freya's Aett
    {
      name: "Fehu",
      meaning: "Cattle, Wealth",
      symbol: "ᚠ",
      pronunciation: "feh-who",
      history:
        "Represents mobile wealth, earned income, and luck. Associated with Norse goddess Freya.",
    },
    {
      name: "Uruz",
      meaning: "Aurochs, Strength",
      symbol: "ᚢ",
      pronunciation: "oo-rooz",
      history:
        "Symbolizes physical strength, speed, and untamed potential. Represents the wild ox.",
    },

    {
      name: "Thurisaz",
      meaning: "Thor, Giant, Thorn",
      symbol: "ᚦ",
      pronunciation: "thur-ee-saz",
      history:
        "Connected to Thor's hammer and defensive force. Represents directed force and protection.",
    },
    {
      name: "Ansuz",
      meaning: "Odin, God, Communication",
      symbol: "ᚨ",
      pronunciation: "ahn-sooz",
      history:
        "Associated with Odin and divine communication. Represents wisdom and communication.",
    },
    {
      name: "Raidho",
      meaning: "Ride, Journey",
      symbol: "ᚱ",
      pronunciation: "rye-though",
      history: "Represents the cosmic order and physical/spiritual journeys.",
    },
    {
      name: "Kenaz",
      meaning: "Torch, Knowledge",
      symbol: "ᚲ",
      pronunciation: "ken-aaz",
      history:
        "Symbolizes knowledge, learning, and technical ability. Represents illumination.",
    },
    {
      name: "Gebo",
      meaning: "Gift",
      symbol: "ᚷ",
      pronunciation: "gay-boo",
      history:
        "Represents gifts, generosity, and partnerships. Symbolizes exchange and balance.",
    },
    {
      name: "Wunjo",
      meaning: "Joy, Pleasure",
      symbol: "ᚹ",
      pronunciation: "wun-yo",
      history:
        "Represents joy, pleasure, and fellowship. Symbolizes harmony and well-being.",
    },

    // Hagal's Aett
    {
      name: "Hagalaz",
      meaning: "Hail",
      symbol: "ᚺ",
      pronunciation: "hah-gah-lahz",
      history: "Represents destructive natural forces and radical change.",
    },
    {
      name: "Nauthiz",
      meaning: "Need, Necessity",
      symbol: "ᚾ",
      pronunciation: "now-theez",
      history:
        "Symbolizes need, restriction, and resistance. Represents personal development through hardship.",
    },
    {
      name: "Isa",
      meaning: "Ice",
      symbol: "ᛁ",
      pronunciation: "ee-sa",
      history:
        "Represents stillness, stasis, and self-containment. Symbolizes challenges and preservation.",
    },
    {
      name: "Jera",
      meaning: "Year, Harvest",
      symbol: "ᛃ",
      pronunciation: "yeh-rah",
      history:
        "Represents the harvest cycle and reward after hard work. Symbolizes fruition.",
    },
    {
      name: "Eihwaz",
      meaning: "Yew Tree",
      symbol: "ᛇ",
      pronunciation: "eye-wahz",
      history:
        "Connected to the world tree Yggdrasil. Represents stability and enlightenment.",
    },
    {
      name: "Perthro",
      meaning: "Dice Cup, Fate",
      symbol: "ᛈ",
      pronunciation: "per-throw",
      history:
        "Represents fate, luck, and hidden matters. Associated with divination and gaming.",
    },
    {
      name: "Algiz",
      meaning: "Elk, Protection",
      symbol: "ᛉ",
      pronunciation: "al-geez",
      history:
        "Represents protection and connection with divine forces. Symbolizes defense.",
    },
    {
      name: "Sowilo",
      meaning: "Sun",
      symbol: "ᛊ",
      pronunciation: "so-wee-lo",
      history:
        "Represents the sun's energy and success. Symbolizes guidance and goal achievement.",
    },

    // Tyr's Aett
    {
      name: "Tiwaz",
      meaning: "Tyr, Justice",
      symbol: "ᛏ",
      pronunciation: "tee-wahz",
      history:
        "Associated with Tyr, god of justice. Represents honor and righteousness.",
    },
    {
      name: "Berkana",
      meaning: "Birch",
      symbol: "ᛒ",
      pronunciation: "ber-kah-nah",
      history:
        "Represents growth, fertility, and new beginnings. Connected to feminine energy.",
    },
    {
      name: "Ehwaz",
      meaning: "Horse",
      symbol: "ᛖ",
      pronunciation: "eh-wahz",
      history:
        "Symbolizes the partnership between horse and rider. Represents trust and cooperation.",
    },
    {
      name: "Mannaz",
      meaning: "Human",
      symbol: "ᛗ",
      pronunciation: "mah-nahz",
      history:
        "Represents humanity, social order, and intelligence. Symbolizes the self.",
    },
    {
      name: "Laguz",
      meaning: "Lake, Water",
      symbol: "ᛚ",
      pronunciation: "lah-gooz",
      history:
        "Represents water, flow, and psychic abilities. Symbolizes emotions and intuition.",
    },
    {
      name: "Ingwaz",
      meaning: "Ing, Fertility",
      symbol: "ᛜ",
      pronunciation: "ing-wahz",
      history:
        "Associated with the god Ing. Represents completion and family heritage.",
    },
    {
      name: "Dagaz",
      meaning: "Day",
      symbol: "ᛞ",
      pronunciation: "dah-gahz",
      history:
        "Represents breakthrough and transformation. Symbolizes balance and new opportunities.",
    },
    {
      name: "Othala",
      meaning: "Heritage, Property",
      symbol: "ᛟ",
      pronunciation: "oh-thah-la",
      history:
        "Represents inheritance, tradition, and ancestral property. Symbolizes legacy.",
    },
  ],
};
const seedElderFuthark = async () => {
  try {
    // Check if category exists
    let category = await RuneCategory.findOne({
      name: elderFutharkData.category.name,
    });

    if (!category) {
      category = await RuneCategory.create(elderFutharkData.category);
    }

    // Seed each rune, checking for existence first
    for (const runeData of elderFutharkData.runes) {
      const existingRune = await Rune.findOne({ name: runeData.name });

      if (!existingRune) {
        await Rune.create({
          ...runeData,
          category: category._id,
        });
      }
    }

    console.log("Elder Futhark runes seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

module.exports = seedElderFuthark;
