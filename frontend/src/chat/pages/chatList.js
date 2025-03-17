import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Divider, Avatar, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; 
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const ChatList = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch("https://reusehub-h9o5.onrender.com/api/chat", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setChats(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();
    }, []);

    return (
        <Box 
            sx={{ 
                width: "100vw", 
                height: "100vh", 
                bgcolor: "linear-gradient(to bottom, #f3f6fa, #ffffff)", // ✅ רקע עדין יותר
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* כותרת הצ'אטים */}
            <Box 
                sx={{ 
                    width: "100%", 
                    bgcolor: "white", 
                    p: 3, 
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    borderBottom: "2px solid #b0b9c3"
                }}
            >
                <ChatBubbleOutlineIcon fontSize="large" sx={{ color: "#003366", mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
                    Chats
                </Typography>
            </Box>

            {/* רשימת הצ'אטים */}
            <Box 
                sx={{ 
                    width: "100%", 
                    flexGrow: 1, 
                    overflowY: "auto",
                    mt: 1
                }}
            >
                <List>
                    {chats.length === 0 ? (
                        <Typography textAlign="center" sx={{ color: "#666", mt: 4 }}>
                            No chats found
                        </Typography>
                    ) : (
                        chats.map((chat) => {
                            const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                            const sender = lastMessage?.sender?.firstName || "Unknown";
                            const otherParticipant = chat.participants.find(p => p._id !== localStorage.getItem("userId"));
                            const avatarUrl = otherParticipant?.avatar || "https://via.placeholder.com/50";

                            return (
                                <React.Fragment key={chat._id}>
                                    <ListItem
                                        button
                                        onClick={() => navigate(`/chat/${chat._id}`)}
                                        sx={{ 
                                            width: "100%", 
                                            bgcolor: "#f7f9fc", // ✅ רקע בהיר יותר לשורות צ'אט
                                            "&:hover": { 
                                                bgcolor: "#dbe6f1", // ✅ אפקט hover כהה יותר
                                                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
                                            }, 
                                            transition: "0.3s",
                                            color: "#333",
                                            p: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottom: "1px solid #b0b9c3",
                                            borderRadius: "5px"
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}> {/* ✅ הזזתי מעט ימינה */}
                                            <Tooltip title={otherParticipant?.firstName || "User"}>
                                                <Avatar 
                                                    src={avatarUrl} 
                                                    alt={otherParticipant?.firstName || "User"} 
                                                    sx={{ 
                                                        width: 45, 
                                                        height: 45, 
                                                        mr: 2, 
                                                        border: "2px solid #003366",
                                                        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
                                                    }} 
                                                />
                                            </Tooltip>
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ color: "#003366", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                        {otherParticipant?.firstName || "User"}
                                                    </Typography>
                                                }
                                                secondary={
                                                    lastMessage ? (
                                                        <Typography sx={{ color: "#333", fontSize: "0.9rem" }}>
                                                            {sender}: {lastMessage.text}
                                                        </Typography>
                                                    ) : (
                                                        <Typography sx={{ color: "#333", fontSize: "0.9rem" }}>
                                                            No messages yet
                                                        </Typography>
                                                    )
                                                }
                                            />
                                        </Box>
                                        
                                        {/* ✅ חץ לחיץ בצד ימין */}
                                        <ArrowForwardIosIcon sx={{ color: "#555", fontSize: "1.2rem" }} />
                                    </ListItem>
                                </React.Fragment>
                            );
                        })
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default ChatList;
