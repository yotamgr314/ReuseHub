const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, default: 1 }, // Only relevant for Wishlist items

  // **Condition only for DonationAd items**
  condition: {
    type: String,
    enum: ["Like New", "Gently Used", "Heavily Used"],
    required: function () {
      // This ensures "condition" is only required for items in DonationAd
      return this.$__parent?.kind === "DonationAd";
    },
  },

  // **Images only for DonationAd items**
  images: {
    type: [String],
    required: function () {
      // This ensures "images" only exist for items in DonationAd
      return this.$__parent?.kind === "DonationAd";
    },
  },

  // **Custom Status Enums for Each Ad Type**
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
