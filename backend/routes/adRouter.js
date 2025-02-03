const express = require("express");
const { getAllAds, getAdById, deleteAd } = require("../controllers/adController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const adRouter = express.Router();

// Public routes
adRouter.get("/",authenticateMiddleware, getAllAds); // Get all ads
adRouter.get("/:id",authenticateMiddleware, getAdById); // Get single ad by ID

// Protected routes
adRouter.delete("/:id", authenticateMiddleware, deleteAd); // Delete an ad (only the creator)

module.exports = adRouter;
