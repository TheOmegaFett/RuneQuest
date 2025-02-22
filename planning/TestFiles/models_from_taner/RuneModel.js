const { default: mongoose } = require("mongoose");

// Schema with properties
const RuneSchema = new mongoose.Schema({
    
});

// Model from schema
const RuneModel = mongoose.model('Rune', RuneSchema);

module.exports = {
    RuneModel,
};