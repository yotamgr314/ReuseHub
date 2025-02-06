import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import "../styles/chat.css"; // ✅ ייבוא קובץ CSS לעיצוב

const socket = io("http://localhost:5000");

// ✅ 2 צבעים בלבד
const COLORS = ["green", "gray"];

const getUserColor = (userToken, otherToken) => {
    if (!userToken) return COLORS[0]; // ברירת מחדל במקרה של בעיה
    return userToken > otherToken ? COLORS[0] : COLORS[1]; // משתמשים בסדר קבוע לפי ה-token
};

const Chat = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [participants, setParticipants] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userToken, setUserToken] = useState("");
    const [otherUserToken, setOtherUserToken] = useState("");

    useEffect(() => {
        const fetchUserId = async () => {
            const response = await fetch("http://localhost:5000/api/authenticate/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUserId(data.user._id);
                setUserToken(localStorage.getItem("token")); // ✅ שומר את הטוקן של המשתמש
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
                
                // ✅ מגדיר את הטוקן של הצד השני
                const otherUser = data.data.participants.find((p) => p._id !== userId);
                if (otherUser) {
                    setOtherUserToken(otherUser._id); // סימון משתמש שני
                }
            }
        };
        fetchChatMessages();
    }, [chatId, userId]);

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
                    const userColor = getUserColor(msg.sender?._id, otherUserToken);

                    return (
                        <Box key={index} className={`message ${userColor}`}>
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
