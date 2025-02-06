import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper } from "@mui/material";

const ChatList = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/chat", {
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
        <Box sx={{ maxWidth: 500, margin: "auto", p: 2, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>Chats</Typography>
            <Paper sx={{ maxHeight: 400, overflowY: "auto" }}>
                <List>
                    {chats.length === 0 ? (
                        <Typography textAlign="center" sx={{ p: 2 }}>No chats found</Typography>
                    ) : (
                        chats.map((chat) => {
                            const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                            return (
                                <React.Fragment key={chat._id}>
                                    <ListItem
                                        button
                                        onClick={() => navigate(`/chat/${chat._id}`)}
                                        sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}
                                    >
                                        <ListItemText
                                            primary={chat.participants.map((p) => p.firstName).join(", ")}
                                            secondary={lastMessage ? `${lastMessage.sender.firstName}: ${lastMessage.text}` : "No messages yet"}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            );
                        })
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default ChatList;
