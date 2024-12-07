//IMPORTS SECTION
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db.js");

//CONFIGURATION SECTION
dotenv.config(); /*Load environment variables from .env file  */

connectDB(); /*NOTE: calls a function which establish the connection to our mongoDB database */

const app = express();

//MIDDLEWARES SECTION
app.use(cors());

app.use(express.json());

//ROUTES SECTION

app.get("/", (req, res) => {
  res.send("Welcome to the Distributed Cloud Services API");
});

module.exports = app;
