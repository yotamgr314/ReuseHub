import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import "../styles/chat.css"; // ✅ קובץ CSS לעיצוב נוסף

const socket = io("https://reusehub-h9o5.onrender.com");

// ✅ צבעים שונים לכל משתמש
const COLORS = ["#FFDD94", "#AFCBFF"];

const getUserColor = (userToken, otherToken) => {
    if (!userToken) return COLORS[0]; // ברירת מחדל
    return userToken > otherToken ? COLORS[0] : COLORS[1];
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
            const response = await fetch("https://reusehub-h9o5.onrender.com/api/authenticate/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setUserId(data.user._id);
                setUserToken(localStorage.getItem("token"));
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!chatId) return;
        socket.emit("joinChat", chatId);

        const fetchChatMessages = async () => {
            const response = await fetch(`https://reusehub-h9o5.onrender.com/api/chat/${chatId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(data.data.messages || []);
                setParticipants(data.data.participants);

                // ✅ הגדרת המשתמש השני
                const otherUser = data.data.participants.find((p) => p._id !== userId);
                if (otherUser) {
                    setOtherUserToken(otherUser._id);
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
        const response = await fetch(`https://reusehub-h9o5.onrender.com/api/chat/${chatId}`, {
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
        <Box 
            sx={{
                width: "100vw", // ✅ כעת תופס את כל המסך
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "#f8f9fa",
                overflow: "hidden", // ✅ מסיר את הסקרול בר החיצוני
            }}
        >
            <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "#222" }}>
                Chat with {participants.map((p) => p.firstName).join(", ")}
            </Typography>

            {/* חלון הצ'אט מתפרס על כל המסך */}
            <Paper
                sx={{
                    flexGrow: 1,
                    width: "100%", // ✅ מתפרס על כל רוחב הדף
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    overflowY: "auto",
                }}
            >
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender?._id === userId;
                    const userColor = getUserColor(msg.sender?._id, otherUserToken);

                    return (
                        <Box
                            key={index}
                            sx={{
                                maxWidth: "70%",
                                width: "fit-content",
                                bgcolor: userColor,
                                p: 2,
                                borderRadius: "10px",
                                mb: 1,
                                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                                {msg.sender?.firstName}
                            </Typography>
                            <Typography variant="body2">{msg.text}</Typography>
                        </Box>
                    );
                })}
            </Paper>

            {/* שורת ההקלדה */}
            <Box
                sx={{
                    width: "100%", // ✅ מתאים לכל רוחב העמוד
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "white",
                    p: 1,
                    borderTop: "1px solid #ddd",
                    boxShadow: "0px -2px 5px rgba(0,0,0,0.1)"
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    sx={{ mr: 1 }}
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
