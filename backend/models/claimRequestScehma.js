//backend/models/claimRequestSchema.js
const mongoose = require("mongoose");

const claimRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  donationAdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DonationAd",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClaimRequest", claimRequestSchema);
