const { default: mongoose } = require("mongoose");

// Schema with properties
const LessonSchema = new mongoose.Schema({
    
});

// Model from schema
const LessonModel = mongoose.model('Lesson', LessonSchema);

module.exports = {
    LessonModel,
};