//backend/models/donationAdSchema.js
const mongoose = require("mongoose");
const baseAdSchema = require("./baseAdSchema");


const donationOfferSchema = new mongoose.Schema({

recipient_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
status: { type: String, enum: ["Accepted", "Rejected", "Pending"], default: "Pending" },
creation_date: { type: Date, default: Date.now },


});

const donationOfferAd = baseAdSchema.discriminator('donationOfferAd', donationOfferSchema); // Use BaseAd.discriminator
module.exports = donationOfferAd;
