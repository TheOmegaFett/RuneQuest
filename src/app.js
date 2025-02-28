const express = require("express");
const readingRoutes = require("./routes/readingRoutes");

app.use(express.json());
app.use("/api", readingRoutes);
