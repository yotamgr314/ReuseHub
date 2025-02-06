import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const socket = io("http://localhost:5000");

const Chat = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [participants, setParticipants] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const response = await fetch("http://localhost:5000/api/authenticate/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUserId(data.user._id);
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
            setMessages((prev) => [...prev, data.data]);
            setMessageText("");
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", p: 2, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
                Chat with {participants.map((p) => p.firstName).join(", ")}
            </Typography>
            <Paper sx={{ maxHeight: 400, overflowY: "auto", p: 2 }}>
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignSelf: msg.sender?._id === userId ? "flex-end" : "flex-start",
                            bgcolor: msg.sender?._id === userId ? "#1976D2" : "#E0E0E0",
                            color: msg.sender?._id === userId ? "white" : "black",
                            padding: "8px 12px",
                            borderRadius: 2,
                            maxWidth: "70%",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                            {msg.sender?.firstName}
                        </Typography>
                        <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                ))}
            </Paper>
            <TextField fullWidth placeholder="Type a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} sx={{ mt: 2 }} />
            <Button fullWidth variant="contained" color="primary" onClick={sendMessage} sx={{ mt: 1 }}>
                Send
            </Button>
        </Box>
    );
};

export default Chat;
