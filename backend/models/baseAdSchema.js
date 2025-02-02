const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: function () {
      return this.itemType === "DonationAd"; // Only required if the item belongs to a DonationAd
    },
  },
});

const baseAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, default: "" },

    adStatus: {
      type: Boolean,
      enum: ["Available", "deleted", "donation completed"], // once offer status changed to accept in offerSchema.js the corresponding ad status will be changed to "donation completed".
    },

    items: [{ type: itemSchema }],

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: [
          {
            validator: function (value) {
              return value.length === 2; //
            },
            message:
              "Coordinates must be an array with exactly 2 numbers [longitude, latitude].",
          },
          {
            validator: function (value) {
              const [lng, lat] = value;
              return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90; // Longitude and latitude validation
            },
            message:
              "Coordinates must have valid longitude [-180, 180] and latitude [-90, 90].",
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

const BaseAd = mongoose.model("BaseAd", baseAdSchema);
module.exports = BaseAd;
