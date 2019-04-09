import "@babel/polyfill";
import dotenv from "dotenv";
import "./db";
import app from "./app";
import socket from "socket.io";

dotenv.config();

import "./models/Video";
import "./models/Comment";
import "./models/User";

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log(`listening to ${PORT}`);
const server = app.listen(PORT, handleListening);

// socket setup and pass server
const io = socket(server);
io.on("connection", clientSocket => {
  console.log("made socket connection", clientSocket.id);
  clientSocket.on("chat", data => {
    io.sockets.emit("chat", data);
  });
  clientSocket.on("typing", data => {
    clientSocket.broadcast.emit("typing", data);
  });
});
