const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, default: 1 },
  condition: {
    type: String,
    enum: ["Like New", "Gently Used", "Heavily Used"],
    required: function () {
      return this.$__parent?.kind === "DonationAd";
    },
  },
  images: {
    type: [String],
    required: function () {
      return this.$__parent?.kind === "DonationAd";
    },
  },
  status: {
    type: String,
    required: true,
    enum: function () {
      if (this.$__parent?.kind === "DonationAd") {
        return ["available", "claimed", "offered", "donated"];
      }
      if (this.$__parent?.kind === "WishlistAd") {
        return ["wished", "promised", "granted"];
      }
    },
  },
});

module.exports = itemSchema;
