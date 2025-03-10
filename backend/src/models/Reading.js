const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    runes: [
      {
        type: String,

        required: true,
      },
    ],
    interpretation: {
      type: String,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reading", ReadingSchema);
