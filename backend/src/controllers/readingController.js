const Reading = require("../models/Reading");

const readingController = {
  // Get readings for specific user
  async getReadingsForUser(req, res) {
    try {
      const readings = await Reading.find({ user: req.params.userId }).populate(
        "user",
        "username"
      );

      res.status(200).json({
        success: true,
        count: readings.length,
        data: readings,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Modified createReading to include user
  async createReading(req, res) {
    try {
      const reading = await Reading.create({
        ...req.body,
        user: req.params.userId,
      });

      res.status(201).json({
        success: true,
        data: reading,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all readings
  async getAllReadings(req, res) {
    try {
      const readings = await Reading.find();
      res.status(200).json(readings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get reading by ID
  async getReadingById(req, res) {
    try {
      const reading = await Reading.findById(req.params.id);
      if (!reading)
        return res.status(404).json({ message: "Reading not found" });
      res.status(200).json(reading);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update reading
  async updateReading(req, res) {
    try {
      const reading = await Reading.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!reading)
        return res.status(404).json({ message: "Reading not found" });
      res.status(200).json(reading);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete reading
  async deleteReading(req, res) {
    try {
      const reading = await Reading.findByIdAndDelete(req.params.id);
      if (!reading)
        return res.status(404).json({ message: "Reading not found" });
      res.status(200).json({ message: "Reading deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = readingController;
