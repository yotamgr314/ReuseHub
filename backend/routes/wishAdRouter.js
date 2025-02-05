// backend/routes/wishAdRouter.js
const express = require("express");
const { createWishAd } = require("../controllers/wishAdController");
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const wishAdRouter = express.Router();

// Require authentication for creating wish ads
wishAdRouter.post("/", protectMiddleware, createWishAd);

module.exports = wishAdRouter;
