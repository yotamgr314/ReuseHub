// backend/routes/authenticateRouter.js
const express = require("express");
const { register, login } = require("../controllers/authenticateController");
const upload = require("../middlewares/uploadMiddleware"); // Import the upload middleware

const authenticateRouter = express.Router();

// Register a new user
authenticateRouter.post("/register", upload.single("profilePic"),register); // http://localhost:5000/api/authenticate/register

// Login user
authenticateRouter.post("/login", login); 

module.exports = authenticateRouter;