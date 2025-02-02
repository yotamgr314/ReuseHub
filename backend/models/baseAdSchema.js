const mongoose = require("mongoose");

// embedeed item schema.
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  description: { type: String, maxlength: 500 }, // Description length limit
  images: {
    type: [String],
    validate: {
      validator: function () {
        return this.parent().kind === "donationAd"; // Ensure images exist only for donation ads
      },
      message: "Images are required only for donation ads.",
    },
  },
});

const baseAdSchema = new mongoose.Schema(
  {

    adTitle: { type: String, required: true, trim: true, minlength: 5, maxlength: 60 },
    
    adDescription: { type: String, default: "", maxlength: 1000}, // Limit description length

    adStatus: { // once offer status changed to accept in offerSchema.js the corresponding ad status will be changed to "donation completed".
      type: String,
      enum: ["Available", "Deleted", "Donation Completed"],
      default: "Available",
    },

    items: [{ type: itemSchema }],

    category: {
      type: String,
      enum: [
        "Furniture",
        "Clothing",
        "Electronics",
        "Household Appliances",
        "Books",
        "Toys",
        "Sports Equipment",
        "Other"
      ],
      required: true,
    },

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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    createdAt: { type: Date, default: Date.now },
  },

  { discriminatorKey: "kind", collection: "ads", timestamps: true } // Adds createdAt and updatedAt fields
);

baseAdSchema.index({ location: "2dsphere" });
baseAdSchema.index({ createdBy: 1 });

const BaseAd = mongoose.model("BaseAd", baseAdSchema);
module.exports = BaseAd;
