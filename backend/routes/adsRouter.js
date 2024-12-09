const express = require("express");
const router = express.Router();
const { getAllAds } = require('../controllers/adsController.js');

// 🔥 בקשה לקבלת כל המודעות (Wishlist + Donation) עם פאגינציה וגלילה אינסופית
router.get("/", getAllAds);

module.exports = router;
