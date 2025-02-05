module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🔹 A user connected to WebSocket");

    socket.on("joinChat", (offerId) => {
      socket.join(offerId);
      console.log(`🔹 User joined chat for offer ${offerId}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.offerId).emit("newMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("🔹 A user disconnected from WebSocket");
    });
  });
};
