// backend/models/chatSchema.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true }, // 🔹 Chat belongs to an offer
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // 🔹 Sender & Receiver
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
