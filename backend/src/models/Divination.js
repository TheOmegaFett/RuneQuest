const mongoose = require("mongoose");

const divinationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["single", "three", "five"],
    required: true,
  },
  runes: [
    {
      name: String,
      meaning: String,
      position: Number,
    },
  ],
  interpretation: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Divination = mongoose.model("Divination", divinationSchema);

module.exports = Divination;
