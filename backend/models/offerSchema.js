const mongoose = require("mongoose");

const donationAdSchema = new mongoose.Schema({
  userMadeTheOffer: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  adId: { type: mongoose.Schema.Types.ObjectId, ref: "BaseAd" },

  offerStatus: {
    type: String,
    enum: ["rejected", "pending", "accepted"],
  },
  offerConfrimation: {
    type: Boolean,
    enum: ["adOwnerApproval", "userWhoMadeTheOfferApproval"], // only if both boolean are true than offerStatus changes to accepted, once offer status changed to accepts the corresponding ad status will be changed to "donation completed".
  },

  chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }], // Reference to chat messages
  Date: { type: Date },
});
