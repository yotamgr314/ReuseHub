import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/chat`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setChats(data.data || []);
                    if (data.data.length === 1) {
                        navigate(`/chat/${data.data[0]._id}`); // ✅ אם יש רק צ'אט אחד – ננווט אליו אוטומטית
                    }
                } else {
                    console.error(" Error fetching chats:", data.message);
                }
            } catch (error) {
                console.error(" Error fetching chats:", error);
            }
        };

        fetchChats();
    }, []);

    useEffect(() => {
        if (!chatId) return;

        const fetchChatMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setMessages(data.data.messages || []);
                } else {
                    console.error(" Error fetching chat messages:", data.message);
                }
            } catch (error) {
                console.error(" Error fetching chat:", error);
            }
        };

        fetchChatMessages();
    }, [chatId]);

    const sendMessage = async () => {
        if (!messageText.trim() || !chatId) return;

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
                setMessages((prev) => [...prev, data.data]);
                setMessageText("");
            } else {
                console.error(" Error sending message:", data.message);
            }
        } catch (error) {
            console.error(" Error sending message:", error);
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            {!chatId ? (
                <div>
                    <h2>Select a chat:</h2>
                    <ul>
                        {chats.map((chat) => (
                            <li key={chat._id} onClick={() => navigate(`/chat/${chat._id}`)}>
                                Chat with {chat.participants.map((p) => p.firstName).join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <ul>
                        {messages.length === 0 ? <p>No messages yet</p> : messages.map((msg) => (
                            <li key={msg._id}>
                                <strong>{msg.sender?.firstName || "Unknown"}</strong>: {msg.text}
                            </li>
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
            )}
        </div>
    );
};

export default Chat;
