const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adId: { type: mongoose.Schema.Types.ObjectId, ref: "BaseAd", required: true },
    offerAmount: { type: Number, required: true, min: 1 }, // 🔹 Amount of items being offered
    offerStatus: { type: String, enum: ["Rejected", "Pending", "Accepted"], default: "Pending" },
    offerConfirmation: {
        adOwnerApproval: { type: Boolean, default: false },
        userWhoMadeTheOfferApproval: { type: Boolean, default: false }, // ✅ Offer is accepted only if both are true
    },
    chat: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    createdAt: { type: Date, default: Date.now },
});

offerSchema.index({ sender: 1 });
offerSchema.index({ receiver: 1 });

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
