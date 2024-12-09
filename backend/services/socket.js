module.exports = function (io)
 {
    io.on("connection", (socket) => {
      console.log(" A user connected to the WebSocket");
  
      socket.on("disconnect", () => {
        console.log("A user disconnected from the WebSocket");
      });
    });
  };