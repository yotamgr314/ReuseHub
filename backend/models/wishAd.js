const mongoose = require("mongoose");
const baseAdSchema = require("./baseAdSchema");
const itemSchema = require("./itemSchema");

const wishlistAdSchema = new mongoose.Schema({
  urgency: { type: String, enum: ["Low", "Medium", "High"] },
});

const wishAd = baseAdSchema.discriminator("wishAd", wishlistAdSchema);
module.exports = wishAd;
