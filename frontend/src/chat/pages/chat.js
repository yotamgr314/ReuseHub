import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Typography, TextField, Button } from "@mui/material";

const socket = io("http://localhost:5000");

const Chat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // קבלת ה-ID של המשתמש המחובר
        const fetchUserId = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/authenticate/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserId(data.user._id);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!chatId) return;
        socket.emit("joinChat", chatId);

        const fetchChatMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setMessages(data.data.messages || []);
                }
            } catch (error) {
                console.error("Error fetching chat:", error);
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
        try {
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
                setMessages((prev) => [...prev, data.data]);
                setMessageText("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 2, bgcolor: "#f9f9f9", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>Chat</Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, overflowY: "auto", maxHeight: 400, p: 2 }}>
                {messages.map((msg, index) => {
                    const isUserMessage = msg.sender?._id === userId;
                    return (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignSelf: isUserMessage ? "flex-end" : "flex-start",
                                bgcolor: isUserMessage ? "#1976D2" : "#E0E0E0",
                                color: isUserMessage ? "white" : "black",
                                padding: "8px 12px",
                                borderRadius: 2,
                                maxWidth: "70%",
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {msg.sender?.firstName || "Unknown"}
                            </Typography>
                            <Typography variant="body2">{msg.text}</Typography>
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
