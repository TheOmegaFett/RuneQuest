const { default: mongoose } = require("mongoose");

// Subdocument for progression
const ProgressionSchema = new mongoose.Schema({
    
})

// Schema with properties
const UserSchema = new mongoose.Schema({
    
});

// Model from schema
const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel,
};