import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import "../styles/chat.css"; // ✅ ייבוא קובץ CSS לעיצוב

const socket = io("http://localhost:5000");

// ✅ פונקציה שיוצרת צבע ייחודי לפי ה-token
const generateColorFromToken = (token) => {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
        hash = token.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 80%, 70%)`; // ✅ יוצר צבע בגוון ייחודי
    return color;
};

const Chat = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [participants, setParticipants] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userColor, setUserColor] = useState("#000");

    useEffect(() => {
        const fetchUserId = async () => {
            const response = await fetch("http://localhost:5000/api/authenticate/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUserId(data.user._id);
                setUserColor(generateColorFromToken(localStorage.getItem("token"))); // ✅ צבע ייחודי למשתמש הנוכחי
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!chatId) return;
        socket.emit("joinChat", chatId);

        const fetchChatMessages = async () => {
            const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(data.data.messages || []);
                setParticipants(data.data.participants);
            }
        };
        fetchChatMessages();
    }, [chatId]);

    useEffect(() => {
        socket.on("newMessage", (data) => {
            if (data.chatId === chatId) {
                setMessages((prev) => [...prev, data.message]);
            }
        });

        return () => socket.off("newMessage");
    }, [chatId]);

    const sendMessage = async () => {
        if (!messageText.trim()) return;
        const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ text: messageText }),
        });
        const data = await response.json();
        if (response.ok) {
            socket.emit("sendMessage", { chatId, message: data.data });
            setMessageText("");
        }
    };

    return (
        <Box className="chat-container">
            <Typography variant="h5" className="chat-title">
                Chat with {participants.map((p) => p.firstName).join(", ")}
            </Typography>
            <Paper className="chat-messages">
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender?._id === userId;
                    const messageColor = generateColorFromToken(msg.sender?._id || "default");

                    return (
                        <Box
                            key={index}
                            className={`message ${isCurrentUser ? "me" : "other"}`}
                            sx={{ backgroundColor: messageColor }} // ✅ קובע צבע ייחודי לכל משתמש
                        >
                            <Typography variant="body2" className="message-sender">
                                {msg.sender?.firstName}
                            </Typography>
                            <Typography variant="body2">{msg.text}</Typography>
                        </Box>
                    );
                })}
            </Paper>
            <TextField
                fullWidth
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                sx={{ mt: 2 }}
            />
            <Button fullWidth variant="contained" color="primary" onClick={sendMessage} sx={{ mt: 1 }}>
                Send
            </Button>
        </Box>
    );
};

export default Chat;
