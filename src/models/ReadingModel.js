const { default: mongoose } = require("mongoose");

// Schema with properties
const ReadingSchema = new mongoose.Schema({
    
});

// Model from schema
const ReadingModel = mongoose.model('Reading', ReadingSchema);

module.exports = {
    ReadingModel,
};