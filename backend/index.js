const express = require("express");
const app = express();
const port = 3000;

// Import the main router
const mainRouter = require("./routes/mainRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router with a prefix
app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`RuneQuest server listening on port ${port}`);
});
