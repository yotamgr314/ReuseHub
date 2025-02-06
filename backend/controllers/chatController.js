// backend/controllers/chatController.js
const Chat = require("../models/chatSchema");
const Offer = require("../models/offerSchema");

const mongoose = require("mongoose");

exports.getOrCreateChat = async (req, res) => {
    try {
        let { chatId } = req.params;
        
        console.log(`🛠️ Received chatId:`, chatId, "Type:", typeof chatId);

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            console.error("Invalid chatId format:", chatId);
            return res.status(400).json({ success: false, message: "Invalid chat ID format" });
        }

        chatId = new mongoose.Types.ObjectId(chatId);  // Convert to ObjectId

        let chat = await Chat.findById(chatId)
            .populate("messages.sender", "firstName lastName")
            .populate("participants", "firstName lastName")
            .sort({ "messages.timestamp": 1 });  

        if (!chat) {
            console.error("Chat not found for chatId:", chatId);
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
        const { chatId } = req.params;
        const { text } = req.body;

        if (!chatId || chatId === "undefined") {
            return res.status(400).json({ success: false, message: "Chat ID is required." });
        }

        let chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        const message = { sender: req.user._id, text, timestamp: new Date() };
        chat.messages.push(message);
        await chat.save();

        // ✅ שליחת ההודעה בזמן אמת דרך WebSocket
        const io = req.app.get("io");
        chat.participants.forEach((user) => {
            io.to(user.toString()).emit("newMessage", { chatId, message });
        });

        res.status(201).json({ success: true, data: message });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user._id;

        const chats = await Chat.find({ participants: userId }) 
            .populate("participants", "firstName lastName") 
            .populate("messages.sender", "firstName lastName")
            .sort({ updatedAt: -1 }); // 

        res.status(200).json({ success: true, data: chats });
    } catch (error) {
        console.error(" Error fetching user chats:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};