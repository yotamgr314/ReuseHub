const express = require("express");
const { register, login } = require("../controllers/authenticateController");

const authenticateRouter = express.Router();

// Register a new user
authenticateRouter.post("/register", register); // http://localhost:5000/api/authenticate/register

// Login user
authenticateRouter.post("/login", login); 

module.exports = authenticateRouter;
