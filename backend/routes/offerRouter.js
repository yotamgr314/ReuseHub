const express = require("express");
const {
  createOffer,
  getUserOffers,
  updateOfferStatus,
  deleteOffer,
} = require("../controllers/offerController");
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// Require authentication for all offer routes
router.use(protectMiddleware);

// Create a new offer
router.post("/", createOffer);

// Get all offers received by the logged-in user
router.get("/", getUserOffers);

// Delete an offer
router.delete("/:id", deleteOffer);

module.exports = router;
