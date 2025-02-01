//backend/models/wishListAdSchema.js
const mongoose = require("mongoose");
const baseAdSchema = require("./baseAdSchema");

const wishlistAdSchema = new mongoose.Schema({
  urgency: { type: String, enum: ["Low", "Medium", "High"] },
  donation_offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "DonationOffer" }],


});

const WishlistAd = baseAdSchema.discriminator('WishlistAd', wishlistAdSchema); // 🔥 Use BaseAd.discriminator
module.exports = WishlistAd;

