const mongoose = require("mongoose");
const BaseAd = require("./baseAdSchema");

const donationAdSchema = new mongoose.Schema({
  itemCondition: { type: String, enum: ["Like New", "Gently Used", "Heavily Used"] },
  donationMethod: { type: String, enum: ["Pickup", "Delivery", "Other"] },
});

const DonationAd = BaseAd.discriminator("donationAd", donationAdSchema);
module.exports = DonationAd;
