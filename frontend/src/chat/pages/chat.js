import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";  // ✅ הוספת חיבור ל-Socket.io

const socket = io("http://localhost:5000"); // ✅ התחברות לשרת WebSocket

const Chat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        if (!chatId) return;
        socket.emit("joinChat", chatId);  // ✅ הצטרפות לצ'אט בכניסה

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
        // ✅ מאזין להודעות נכנסות ב-WebSocket
        socket.on("newMessage", (data) => {
            if (data.chatId === chatId) {
                setMessages((prev) => [...prev, data.message]); // ✅ עדכון מיידי של ההודעות
            }
        });

        return () => socket.off("newMessage"); // ✅ ניקוי מאזינים בעת יציאה
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
                socket.emit("sendMessage", { chatId, message: data.data }); // ✅ שליחת הודעה בזמן אמת
                setMessages((prev) => [...prev, data.data]);
                setMessageText("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}><strong>{msg.sender?.firstName || "Unknown"}</strong>: {msg.text}</li>
                ))}
            </ul>
            <input 
                type="text" 
                placeholder="Type a message..." 
                value={messageText} 
                onChange={(e) => setMessageText(e.target.value)} 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;