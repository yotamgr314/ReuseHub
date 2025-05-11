// backend/routes/donationAdRouter.js
const upload = require("../middlewares/uploadMiddleware"); // Multer
const protectMiddleware = require("../middlewares/authenticateMiddleware");

const express = require("express");
const { 
  createDonationAd, 
  getAllDonationAds, 
  getDonationAdById, 
  deleteDonationAd 
} = require("../controllers/donationAdController");

const router = express.Router();




// Debugging: Ensure functions are correctly imported
console.log("createDonationAd:", createDonationAd);

// Create a new donation ad (Protected Route)
router.post("/", protectMiddleware, upload.array("images", 5), createDonationAd);


module.exports = router;