const express = require("express");
const { getOrCreateChat, sendMessage } = require("../controllers/chatController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

router.get("/:offerId", authenticateMiddleware, getOrCreateChat);
router.post("/:offerId", authenticateMiddleware, sendMessage);

module.exports = router;
