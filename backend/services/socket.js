module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log("🔹 A user connected to WebSocket");

        socket.on("joinRoom", (userId) => {
            socket.join(userId);
            console.log(`🔹 User joined room: ${userId}`);
        });

        socket.on("joinChat", (chatId) => {
            socket.join(chatId);
            console.log(`🔹 User joined chat: ${chatId}`);
        });

        socket.on("sendMessage", (data) => {
            io.to(data.chatId).emit("newMessage", data); // שליחת ההודעה למשתמשים בצ'אט
        });

        socket.on("disconnect", () => {
            console.log("🔹 A user disconnected from WebSocket");
        });
    });
};
