// backend/routes/offerRouter.js
const express = require("express");
const {
  sendOffer,
  getUserOffers,
  updateOfferStatus,
  deleteOffer,
  getSentOffers,    // נוספה
  getReceivedOffers, // נוספה
} = require("../controllers/offerController");
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// Require authentication for all offer routes
router.use(protectMiddleware);

// Create a new offer
router.post("/", sendOffer);

// נתיב לקבלת ההצעות שנשלחו (sent offers)
router.get("/sent", getSentOffers);

// נתיב לקבלת ההצעות שהתקבלו (received offers)
router.get("/received", getReceivedOffers);


// Get all offers received by the logged-in user
router.get("/", getUserOffers);

// Delete an offer
router.delete("/:id", deleteOffer);

// Update offer status (Approve/Reject) (PATCH /api/offers/:id)
router.patch("/:id", updateOfferStatus);


module.exports = router;