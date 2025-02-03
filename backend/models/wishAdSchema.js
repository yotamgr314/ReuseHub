const mongoose = require("mongoose");
const BaseAd = require("./baseAdSchema");

const wishAdSchema = new mongoose.Schema({
  urgency: { type: String, enum: ["Low", "Medium", "High"], required: true },
});

const WishAd = BaseAd.discriminator("wishAd", wishAdSchema);
module.exports = WishAd;
