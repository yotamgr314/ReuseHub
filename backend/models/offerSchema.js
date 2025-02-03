const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adId: { type: mongoose.Schema.Types.ObjectId, ref: "BaseAd", required: true },
    offerStatus: { type: String, enum: ["Rejected", "Pending", "Accepted"], default: "Pending" },
    offerConfirmation: {
        adOwnerApproval: { type: Boolean, default: false },
        userWhoMadeTheOfferApproval: { type: Boolean, default: false },// only if both boolean are true than offerStatus changes to accepted, once offer status changed to accepts the corresponding ad status will be changed to "donation completed".
      },
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    createdAt: { type: Date, default: Date.now },

});

offerSchema.index({ sender: 1 });
offerSchema.index({ receiver: 1 });

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;





