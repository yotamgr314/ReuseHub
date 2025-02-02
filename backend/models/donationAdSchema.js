const mongoose = require("mongoose");
const baseAdSchema = require("./baseAdSchema");
const itemSchema = require("./itemSchema");

const donationAdSchema = new mongoose.Schema({
  ItemCondition: {
    type: String,
    enum: ["Like New", "Gently Used", "Heavily Used"],
  },
});

const DonationAd = baseAdSchema.discriminator("DonationAd", donationAdSchema); // Use BaseAd.discriminator
module.exports = DonationAd;
