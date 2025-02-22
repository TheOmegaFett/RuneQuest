const express = require("express");
const connectDB = require("./config/db");
const mainRouter = require("./routes/mainRouter");

const initializeDatabase = require("./config/initDB");

// Connect to MongoDB
connectDB();

// Call after MongoDB connection is established
initializeDatabase();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`RuneQuest server listening on port ${port}`);
});
