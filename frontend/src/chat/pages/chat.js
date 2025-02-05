import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000"); // ✅ WebSocket client connection

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (!chatId || chatId === "undefined") {
      console.error("❌ Invalid chat ID:", chatId);
      return;
    }

    socket.emit("joinChat", chatId); // ✅ Join chat room

    const fetchChat = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await response.json();
        if (response.ok) {
          setMessages(data.data.messages || []);
        } else {
          console.error("❌ Error fetching chat messages:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching chat:", error);
      }
    };

    fetchChat();

    socket.on("newMessage", (newMessage) => {
      console.log("📩 New message received via WebSocket:", newMessage);
      setMessages((prev) => [...prev, newMessage]); // ✅ Real-time update
    });

    return () => {
      socket.off("newMessage");
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${chatId}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: messageText }),
      });

      const data = await response.json();

      if (response.ok) {
        socket.emit("sendMessage", { chatId, ...data.data }); // ✅ Emit to WebSocket
        setMessages((prev) => [...prev, data.data]); // ✅ Append message
        setMessageText(""); // ✅ Clear input
      } else {
        console.error("❌ Error sending message:", data.message);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.length === 0 ? <p>No messages yet</p> : messages.map((msg) => (
          <li key={msg._id}><strong>{msg.sender?.firstName}</strong>: {msg.text}</li>
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
