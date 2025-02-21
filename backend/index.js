const express = require("express");
const connectDB = require("./config/db");
const mainRouter = require("./routes/mainRouter");

// Connect to MongoDB
connectDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`RuneQuest server listening on port ${port}`);
});
