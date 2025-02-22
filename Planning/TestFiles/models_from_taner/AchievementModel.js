const { default: mongoose } = require("mongoose");

// Schema with properties
const AchievementSchema = new mongoose.Schema({
    
});

// Model from schema
const AchievementModel = mongoose.model('Achievement', AchievementSchema);

module.exports = {
    AchievementModel,
};