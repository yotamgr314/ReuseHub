const express = require("express");
const { getOrCreateChat, sendMessage } = require("../controllers/chatController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();


router.get("/:chatId", authenticateMiddleware, getOrCreateChat);
router.post("/:chatId", authenticateMiddleware, sendMessage);

module.exports = router;
