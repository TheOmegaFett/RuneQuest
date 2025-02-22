const express = require("express");
const { connectDB } = require("./config/db");
const mainRouter = require("./src/routes/mainRouter");
const dotenv = require("dotenv")

// Connect to MongoDB
connectDB();

// Configure dotenv
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log(`RuneQuest server listening on port ${PORT}`);
});
