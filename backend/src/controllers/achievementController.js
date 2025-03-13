const Achievement = require("../models/Achievement");

exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().lean();

    return res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id).lean();

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);

    return res.status(201).json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
