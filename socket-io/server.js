const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // 解決 CORS 問題
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} is connected!`);

  socket.on('message', (data) => {
    socket.broadcast.emit('message:received', data)
  })

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} left.`);
  });
});

const serverPort = 3000;

server.listen(serverPort, () => {
  console.log(`Chat Server is running on ${serverPort} !!!`);
});
