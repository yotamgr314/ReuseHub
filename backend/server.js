// IMPORTS SECTION
const app = require("./app.js");
const http = require("http");
const PORT = process.env.PORT || 5000;
const { Server } = require("socket.io");


const newServer = http.createServer(app);
const io = new Server(newServer, {
  cors: {
    origin: "http//localhost:3000",
    methods: ["GET", "POST"],
  },
});

//make websocket acceable in the controllers
app.set("io", io);

// handle websocket connections
require("./services/socket")(io);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


