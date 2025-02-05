import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  console.log("📢 Chat ID received in Chat component:", chatId); // ✅ Debugging log

  useEffect(() => {
    if (!chatId) {
      console.error("❌ Invalid chat ID:", chatId);
      return;
    }

    const fetchChat = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await response.json();
        console.log("📩 Chat messages received:", data);

        if (response.ok) {
          setMessages(data.data.messages);
        } else {
          console.error("❌ Error fetching chat messages:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching chat:", error);
      }
    };

    fetchChat();
  }, [chatId]);

  return <div>Chat Page</div>;
};

export default Chat;
