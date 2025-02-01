//backend/models/baseAdSchema.js
const mongoose = require("mongoose");

// embedded item schema inside donationOffer
const itemSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
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
  

  
// NOTE: BaseSchema - all types of ads will have these fields.
const baseAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" }, // Optional with default
    item: {type: itemSchema},
    location: {
      type: { type: String, enum: ["Point"], default: "Point" }, // GeoJSON type
      coordinates: {
        type: [Number], // Longitude, Latitude
        required: true,
        validate: [
          {
            validator: function (value) {
              return value.length === 2; // Ensure two values
            },
            message: "Coordinates must be an array with exactly 2 numbers [longitude, latitude].",
          },
          {
            validator: function (value) {
              const [lng, lat] = value;
              return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90; // Longitude and latitude validation
            },
            message: "Coordinates must have valid longitude [-180, 180] and latitude [-90, 90].",
          },
        ],
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { discriminatorKey: "kind", collection: "ads", timestamps: true } // Adds createdAt and updatedAt fields
);

// Add geospatial index for location
baseAdSchema.index({ location: "2dsphere" }); // Required for geospatial queries

// Add index on createdBy to improve filtering performance
baseAdSchema.index({ createdBy: 1 });

// Create the BaseAd model
const BaseAd = mongoose.model("BaseAd", baseAdSchema);

module.exports = BaseAd; // Exporting the model
