// backend/routes/chatRouter.js
const express = require("express");
const { getOrCreateChat, sendMessage, getUserChats } = require("../controllers/chatController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const router = express.Router();

// אחזור רשימת כל השיחות של המשתמש
router.get("/", authenticateMiddleware, getUserChats);

//  קבלת צ'אט מסוים או יצירתו אם לא קיים
router.get("/:chatId", authenticateMiddleware, getOrCreateChat);

//  שליחת הודעה בצ'אט קיים
router.post("/:chatId", authenticateMiddleware, sendMessage);

module.exports = router;