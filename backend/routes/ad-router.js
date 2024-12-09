const express = require("express");
const adRouter = express.Router();
const { getAllAds } = require('../controllers/ad-controller.js');

// 🔥 בקשה לקבלת כל המודעות (Wishlist + Donation) עם פאגינציה וגלילה אינסופית
adRouter.get("/", getAllAds);

module.exports = adRouter;
