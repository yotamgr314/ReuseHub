// backend/routes/authenticateRouter.js
const express = require("express");
const { register, login } = require("../controllers/authenticateController");

const authenticateRouter = express.Router();

// Register a new user
authenticateRouter.post("/register", register); // https://reusehub-h9o5.onrender.com/api/authenticate/register

// Login user
authenticateRouter.post("/login", login); 

module.exports = authenticateRouter;