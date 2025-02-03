const express = require("express");
const {
  sendOffer,
  getUserOffers,
  updateOfferStatus,
  deleteOffer,
} = require("../controllers/offerController");
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// Require authentication for all offer routes
router.use(protectMiddleware);

// Create a new offer
router.post("/", sendOffer);

// Get all offers received by the logged-in user
router.get("/", getUserOffers);

// Delete an offer
router.patch("/:id", deleteOffer);

// ✅ Update offer status (Approve/Reject) (PATCH /api/offers/:id)
router.patch("/:id", updateOfferStatus);


module.exports = router;
