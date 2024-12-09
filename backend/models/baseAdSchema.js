const mongoose = require("mongoose");

// NOTE: BaseSchema - all types of ads will have these fields.
const baseAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) { 
            return value.length === 2;
          },
          message: "coordinates must be an array with exactly 2 numbers [longitude, latitude]"
        }
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "kind", collection: "ads" }
);

const BaseAd = mongoose.model("BaseAd", baseAdSchema); // creating a model out of the schema with the name BaseAd.

module.exports = BaseAd; // exporting the model

