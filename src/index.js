// Import the configured server 
// and run it 

const dotenv = require("dotenv");
dotenv.config();

const { app } = require("./server");


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});