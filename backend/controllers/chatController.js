const Chat = require("../models/chatSchema");
const Offer = require("../models/offerSchema");

// ✅ Create or Retrieve Chat for an Offer
exports.getOrCreateChat = async (req, res) => {
  try {
    const { offerId } = req.params;

    let chat = await Chat.findOne({ offerId }).populate("messages.sender", "firstName lastName");

    if (!chat) {
      const offer = await Offer.findById(offerId);
      if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });

      chat = new Chat({
        offerId,
        participants: [offer.sender, offer.receiver],
        messages: [],
      });

      await chat.save();
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
    try {
      const { offerId } = req.params;
      const { text } = req.body;
  
      console.log("📩 Received sendMessage request:", { offerId, text, sender: req.user._id });
  
      if (!offerId || offerId === "undefined") {
        console.error("❌ Missing offerId in sendMessage API");
        return res.status(400).json({ success: false, message: "Offer ID is required." });
      }
  
      let chat = await Chat.findOne({ offerId });
      if (!chat) {
        console.error("❌ Chat not found for offerId:", offerId);
        return res.status(404).json({ success: false, message: "Chat not found" });
      }
  
      const message = { sender: req.user._id, text };
      chat.messages.push(message);
  
      await chat.save();
      console.log("✅ Message saved to chat:", message);
  
      // Notify participants via WebSocket
      const io = req.app.get("io");
      io.to(offerId.toString()).emit("newMessage", message);
  
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error("❌ Error sending message:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  