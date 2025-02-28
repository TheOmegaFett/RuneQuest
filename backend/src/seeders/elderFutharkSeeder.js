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
      relationships: [
        { rune: "Othala", relationshipType: "wealth manifestation" },
        { rune: "Gebo", relationshipType: "exchange of resources" },
        { rune: "Jera", relationshipType: "cyclical prosperity" },
      ],
    },
    {
      name: "Uruz",
      meaning: "Aurochs, Strength",
      symbol: "ᚢ",
      pronunciation: "oo-rooz",
      history:
        "Symbolizes physical strength, speed, and untamed potential. Represents the wild ox.",
      relationships: [
        { rune: "Thurisaz", relationshipType: "raw power" },
        { rune: "Algiz", relationshipType: "primal protection" },
        { rune: "Tiwaz", relationshipType: "directed strength" },
      ],
    },
    {
      name: "Thurisaz",
      meaning: "Thor, Giant, Thorn",
      symbol: "ᚦ",
      pronunciation: "thur-ee-saz",
      history:
        "Connected to Thor's hammer and defensive force. Represents directed force and protection.",
      relationships: [
        { rune: "Uruz", relationshipType: "defensive power" },
        { rune: "Algiz", relationshipType: "protective barrier" },
        { rune: "Isa", relationshipType: "controlled force" },
      ],
    },
    {
      name: "Ansuz",
      meaning: "Odin, God, Communication",
      symbol: "ᚨ",
      pronunciation: "ahn-sooz",
      history:
        "Associated with Odin and divine communication. Represents wisdom and communication.",
      relationships: [
        { rune: "Kenaz", relationshipType: "divine knowledge" },
        { rune: "Mannaz", relationshipType: "spiritual guidance" },
        { rune: "Dagaz", relationshipType: "enlightenment" },
      ],
    },
    {
      name: "Raidho",
      meaning: "Ride, Journey",
      symbol: "ᚱ",
      pronunciation: "rye-though",
      history: "Represents the cosmic order and physical/spiritual journeys.",
      relationships: [
        { rune: "Ehwaz", relationshipType: "physical journey" },
        { rune: "Laguz", relationshipType: "flow of movement" },
        { rune: "Jera", relationshipType: "cyclical progress" },
      ],
    },
    {
      name: "Kenaz",
      meaning: "Torch, Knowledge",
      symbol: "ᚲ",
      pronunciation: "ken-aaz",
      history:
        "Symbolizes knowledge, learning, and technical ability. Represents illumination.",
      relationships: [
        { rune: "Ansuz", relationshipType: "wisdom sharing" },
        { rune: "Dagaz", relationshipType: "illumination" },
        { rune: "Sowilo", relationshipType: "enlightening energy" },
      ],
    },
    {
      name: "Gebo",
      meaning: "Gift",
      symbol: "ᚷ",
      pronunciation: "gay-boo",
      history:
        "Represents gifts, generosity, and partnerships. Symbolizes exchange and balance.",
      relationships: [
        { rune: "Fehu", relationshipType: "generous exchange" },
        { rune: "Wunjo", relationshipType: "joyful giving" },
        { rune: "Ehwaz", relationshipType: "partnership" },
      ],
    },
    {
      name: "Wunjo",
      meaning: "Joy, Pleasure",
      symbol: "ᚹ",
      pronunciation: "wun-yo",
      history:
        "Represents joy, pleasure, and fellowship. Symbolizes harmony and well-being.",
      relationships: [
        { rune: "Gebo", relationshipType: "shared happiness" },
        { rune: "Sowilo", relationshipType: "radiant joy" },
        { rune: "Dagaz", relationshipType: "breakthrough happiness" },
      ],
    },

    // Hagal's Aett
    {
      name: "Hagalaz",
      meaning: "Hail",
      symbol: "ᚺ",
      pronunciation: "hah-gah-lahz",
      history: "Represents destructive natural forces and radical change.",
      relationships: [
        { rune: "Nauthiz", relationshipType: "destructive transformation" },
        { rune: "Isa", relationshipType: "frozen chaos" },
        { rune: "Thurisaz", relationshipType: "controlled disruption" },
      ],
    },
    {
      name: "Nauthiz",
      meaning: "Need, Necessity",
      symbol: "ᚾ",
      pronunciation: "now-theez",
      history:
        "Symbolizes need, restriction, and resistance. Represents personal development through hardship.",
      relationships: [
        { rune: "Hagalaz", relationshipType: "forced change" },
        { rune: "Isa", relationshipType: "resistance" },
        { rune: "Perthro", relationshipType: "destined challenge" },
      ],
    },
    {
      name: "Isa",
      meaning: "Ice",
      symbol: "ᛁ",
      pronunciation: "ee-sa",
      history:
        "Represents stillness, stasis, and self-containment. Symbolizes challenges and preservation.",
      relationships: [
        { rune: "Nauthiz", relationshipType: "frozen state" },
        { rune: "Hagalaz", relationshipType: "suspended action" },
        { rune: "Eihwaz", relationshipType: "endurance" },
      ],
    },
    {
      name: "Jera",
      meaning: "Year, Harvest",
      symbol: "ᛃ",
      pronunciation: "yeh-rah",
      history:
        "Represents the harvest cycle and reward after hard work. Symbolizes fruition.",
      relationships: [
        { rune: "Fehu", relationshipType: "earned rewards" },
        { rune: "Berkana", relationshipType: "natural growth" },
        { rune: "Ingwaz", relationshipType: "completion" },
      ],
    },
    {
      name: "Eihwaz",
      meaning: "Yew Tree",
      symbol: "ᛇ",
      pronunciation: "eye-wahz",
      history:
        "Connected to the world tree Yggdrasil. Represents stability and enlightenment.",
      relationships: [
        { rune: "Algiz", relationshipType: "spiritual protection" },
        { rune: "Mannaz", relationshipType: "spiritual growth" },
        { rune: "Isa", relationshipType: "steadfast endurance" },
      ],
    },
    {
      name: "Perthro",
      meaning: "Dice Cup, Fate",
      symbol: "ᛈ",
      pronunciation: "per-throw",
      history:
        "Represents fate, luck, and hidden matters. Associated with divination and gaming.",
      relationships: [
        { rune: "Nauthiz", relationshipType: "fated necessity" },
        { rune: "Dagaz", relationshipType: "revealed mysteries" },
        { rune: "Ansuz", relationshipType: "divine guidance" },
      ],
    },
    {
      name: "Algiz",
      meaning: "Elk, Protection",
      symbol: "ᛉ",
      pronunciation: "al-geez",
      history:
        "Represents protection and connection with divine forces. Symbolizes defense.",
      relationships: [
        { rune: "Thurisaz", relationshipType: "active defense" },
        { rune: "Eihwaz", relationshipType: "spiritual shield" },
        { rune: "Uruz", relationshipType: "protective strength" },
      ],
    },
    {
      name: "Sowilo",
      meaning: "Sun",
      symbol: "ᛊ",
      pronunciation: "so-wee-lo",
      history:
        "Represents the sun's energy and success. Symbolizes guidance and goal achievement.",
      relationships: [
        { rune: "Dagaz", relationshipType: "illuminating success" },
        { rune: "Kenaz", relationshipType: "guiding light" },
        { rune: "Wunjo", relationshipType: "radiant joy" },
      ],
    },

    // Tyr's Aett
    {
      name: "Tiwaz",
      meaning: "Tyr, Justice",
      symbol: "ᛏ",
      pronunciation: "tee-wahz",
      history:
        "Associated with Tyr, god of justice. Represents honor and righteousness.",
      relationships: [
        { rune: "Mannaz", relationshipType: "just leadership" },
        { rune: "Algiz", relationshipType: "righteous protection" },
        { rune: "Uruz", relationshipType: "warrior strength" },
      ],
    },
    {
      name: "Berkana",
      meaning: "Birch",
      symbol: "ᛒ",
      pronunciation: "ber-kah-nah",
      history:
        "Represents growth, fertility, and new beginnings. Connected to feminine energy.",
      relationships: [
        { rune: "Ingwaz", relationshipType: "fertile growth" },
        { rune: "Jera", relationshipType: "natural cycles" },
        { rune: "Laguz", relationshipType: "nurturing flow" },
      ],
    },
    {
      name: "Ehwaz",
      meaning: "Horse",
      symbol: "ᛖ",
      pronunciation: "eh-wahz",
      history:
        "Symbolizes the partnership between horse and rider. Represents trust and cooperation.",
      relationships: [
        { rune: "Mannaz", relationshipType: "harmonious partnership" },
        { rune: "Raidho", relationshipType: "guided journey" },
        { rune: "Gebo", relationshipType: "mutual trust" },
      ],
    },
    {
      name: "Mannaz",
      meaning: "Human",
      symbol: "ᛗ",
      pronunciation: "mah-nahz",
      history:
        "Represents humanity, social order, and intelligence. Symbolizes the self.",
      relationships: [
        { rune: "Ehwaz", relationshipType: "human connection" },
        { rune: "Ansuz", relationshipType: "divine humanity" },
        { rune: "Tiwaz", relationshipType: "social justice" },
      ],
    },
    {
      name: "Laguz",
      meaning: "Lake, Water",
      symbol: "ᛚ",
      pronunciation: "lah-gooz",
      history:
        "Represents water, flow, and psychic abilities. Symbolizes emotions and intuition.",
      relationships: [
        { rune: "Berkana", relationshipType: "flowing growth" },
        { rune: "Perthro", relationshipType: "intuitive wisdom" },
        { rune: "Raidho", relationshipType: "fluid movement" },
      ],
    },
    {
      name: "Ingwaz",
      meaning: "Ing, Fertility",
      symbol: "ᛜ",
      pronunciation: "ing-wahz",
      history:
        "Associated with the god Ing. Represents completion and family heritage.",
      relationships: [
        { rune: "Othala", relationshipType: "ancestral fertility" },
        { rune: "Berkana", relationshipType: "growth potential" },
        { rune: "Jera", relationshipType: "cyclical completion" },
      ],
    },
    {
      name: "Dagaz",
      meaning: "Day",
      symbol: "ᛞ",
      pronunciation: "dah-gahz",
      history:
        "Represents breakthrough and transformation. Symbolizes balance and new opportunities.",
      relationships: [
        { rune: "Sowilo", relationshipType: "enlightened breakthrough" },
        { rune: "Kenaz", relationshipType: "transformative knowledge" },
        { rune: "Perthro", relationshipType: "revealed wisdom" },
      ],
    },
    {
      name: "Othala",
      meaning: "Heritage, Property",
      symbol: "ᛟ",
      pronunciation: "oh-thah-la",
      history:
        "Represents inheritance, tradition, and ancestral property. Symbolizes legacy.",
      relationships: [
        { rune: "Fehu", relationshipType: "inherited wealth" },
        { rune: "Ingwaz", relationshipType: "ancestral connection" },
        { rune: "Mannaz", relationshipType: "social heritage" },
      ],
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

    // First pass: Create all runes without relationships
    const runeMap = new Map();
    for (const runeData of elderFutharkData.runes) {
      const { relationships, ...runeWithoutRelationships } = runeData;
      let rune = await Rune.findOne({ name: runeData.name });

      if (!rune) {
        rune = await Rune.create({
          ...runeWithoutRelationships,
          category: category._id,
        });
      }
      runeMap.set(rune.name, rune._id);
    }

    // Second pass: Update runes with relationships
    for (const runeData of elderFutharkData.runes) {
      if (runeData.relationships) {
        const rune = await Rune.findOne({ name: runeData.name });
        const relationships = runeData.relationships.map((rel) => ({
          rune: runeMap.get(rel.rune),
          relationshipType: rel.relationshipType,
        }));

        await Rune.findByIdAndUpdate(rune._id, { relationships });
      }
    }

    console.log("Elder Futhark runes seeded successfully with relationships");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

module.exports = seedElderFuthark;
