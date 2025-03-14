// backend/routes/ratingRouter.js

const express = require("express");
const { submitRating } = require("../controllers/ratingController");
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// POST /api/ratings
router.post("/", protectMiddleware, submitRating);

module.exports = router;


