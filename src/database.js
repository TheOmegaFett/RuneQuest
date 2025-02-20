const { default: mongoose } = require("mongoose")


// Connect to the database
async function connect(databaseURL) {
    console.log("Database connecting to " + databaseURL)
    await mongoose.connect(databaseURL)
    console.log("Database connected.")
};

// Disconnect from the database
async function disconnect() {
    await mongoose.connection.close()
};

// Export functions
module.exports = {
    connect, 
    disconnect,
}