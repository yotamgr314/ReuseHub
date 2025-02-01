//backend/models/baseAdSchema.js
const mongoose = require("mongoose");

// NOTE: BaseSchema - all types of ads will have these fields.
const baseAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" }, // Optional with default
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
