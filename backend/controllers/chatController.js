const Chat = require("../models/chatSchema");
const Offer = require("../models/offerSchema");

exports.getOrCreateChat = async (req, res) => {
    try {
      const { chatId } = req.params;
  
      if (!chatId || chatId === "undefined") {
        return res.status(400).json({ success: false, message: "Invalid chat ID" });
      }
  
      console.log(`📢 Fetching chat for chatId: ${chatId}`);
  
      let chat = await Chat.findById(chatId)
        .populate("messages.sender", "firstName lastName")
        .populate("participants", "firstName lastName");
  
      if (!chat) {
        return res.status(404).json({ success: false, message: "Chat not found" });
      }
  
      res.status(200).json({ success: true, data: chat });
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
exports.sendMessage = async (req, res) => {
    try {
      const { chatId } = req.params;  // 🔹 Use chatId, not offerId
      const { text } = req.body;

      console.log("📩 Received sendMessage request:", { chatId, text, sender: req.user._id });

      if (!chatId || chatId === "undefined") {
        console.error("❌ Missing chatId in sendMessage API");
        return res.status(400).json({ success: false, message: "Chat ID is required." });
      }

      let chat = await Chat.findById(chatId);
      if (!chat) {
        console.error("❌ Chat not found for chatId:", chatId);
        return res.status(404).json({ success: false, message: "Chat not found" });
      }

      const message = { sender: req.user._id, text, timestamp: new Date() };
      chat.messages.push(message);

      await chat.save();
      console.log("✅ Message saved to chat:", message);

      // ✅ Notify both participants via WebSocket
      const io = req.app.get("io");
      chat.participants.forEach((user) => {
        io.to(user.toString()).emit("newMessage", message);
      });

      res.status(201).json({ success: true, data: message });
    } catch (error) {
      console.error("❌ Error sending message:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
};
