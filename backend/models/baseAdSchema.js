const mongoose = require("mongoose");

const baseAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
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

module.exports = baseAdSchema;
