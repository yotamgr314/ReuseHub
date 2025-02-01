//backend/models/itemSchema.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  itemType: {
    type: String,
    required: true, // NOTE: Every item must specify its type (DonationAd or WishlistAd)
    enum: ["DonationAd", "WishlistAd"] // NOTE:  Restrict the item types to predefined values
  },
  condition: {
    type: String,
    enum: ["Like New", "Gently Used", "Heavily Used"], // NOTE: Define valid conditions for DonationAd items
    required: function () {
      return this.itemType === "DonationAd"; // NOTE:  Only required if the item belongs to a DonationAd
    }
  },
  images: {
    type: [String], // Array of image URLs
    required: function () {
      return this.itemType === "DonationAd"; // Only required if the item belongs to a DonationAd
    }
  },
  status: {
    type: String,
    required: true, // Status is mandatory for all items
    validate: {
      validator: function (value) {

        const donationStatuses = ["available", "claimed", "offered", "donated"]; // Valid statuses for DonationAd
        const wishlistStatuses = ["wished", "promised", "granted"]; // Valid statuses for WishlistAd

        // Check if the status matches the valid values based on the item type
        if (this.itemType === "DonationAd")
        {
          return donationStatuses.includes(value);

        }else if (this.itemType === "WishlistAd")
        {
          return wishlistStatuses.includes(value);
        }
        return false; // Return false if itemType is invalid
      },
      message: (props) => 
        `\`${props.value}\` is not a valid enum value for path \`status\`.` 
    }
  }
});

module.exports = itemSchema; 


















/* const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, default: 1 },

  condition: {
    type: String,
    enum: ["Like New", "Gently Used", "Heavily Used"],
    required: function () { // NOTE: This ensures "condition" is only required for items in DonationAd
      return this.$__parent?.kind === "DonationAd";
    },
  },
  images: {
    type: [String],
    required: function () {
      return this.$__parent?.kind === "DonationAd"; // NOTE: This ensures "images" only exist for items in DonationAd
    },
  },
  status: {
    type: String,
    required: true,
    enum: function () {
      if (this.$__parent?.kind === "DonationAd") // NOTE this ensures custom enum for donationAd
      {
        return ["available", "claimed", "offered", "donated"];
      }
      if (this.$__parent?.kind === "WishlistAd") // NOTE this ensures custom enum for WishListAd
      {
        return ["wished", "promised", "granted"];
      }
    },
  },
});

module.exports = itemSchema;
 */



