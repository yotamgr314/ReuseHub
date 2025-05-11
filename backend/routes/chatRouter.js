// backend/routes/chatRouter.js
const express = require("express");
const { getOrCreateChat, sendMessage, getUserChats } = require("../controllers/chatController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// Retrive all the chats belongs to a user.
router.get("/", authenticateMiddleware, getUserChats);

router.get("/:chatId", authenticateMiddleware, getOrCreateChat);

// Sends a message in an existing chat.
router.post("/:chatId", authenticateMiddleware, sendMessage);

module.exports = router;