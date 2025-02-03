const express = require("express");
const { 
  createDonationAd, 
  getAllDonationAds, 
  getDonationAdById, 
  deleteDonationAd 
} = require("../controllers/donationAdController");
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// Debugging: Ensure functions are correctly imported
console.log("createDonationAd:", createDonationAd);

// ✅ Create a new donation ad (Protected Route)
router.post("/", protectMiddleware, createDonationAd);


module.exports = router;
