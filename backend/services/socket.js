// backend/services/socket.js
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🔹 A user connected to WebSocket");

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`🔹 User joined chat: ${chatId}`);
    });

    socket.on("sendMessage", (data) => {
      console.log("📩 WebSocket message received:", data);
      io.to(data.chatId).emit("newMessage", data); // Broadcast to all in the room
    });

    socket.on("disconnect", () => {
      console.log("🔹 A user disconnected from WebSocket");
    });
  });
};
