import express from "express";
import http from "http";
import { Server } from "socket.io";
import { initMediasoup, getRouter } from "./mediasoup.js";
import { startAdminRecording } from "./recorder.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let router;
let rooms = {};

(async () => {
  router = await initMediasoup();
})();

io.on("connection", (socket) => {

  socket.on("join-room", ({ roomId, role }) => {
    socket.roomId = roomId;
    socket.role = role;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        producers: [],
        adminRecorder: null
      };
    }

    if (role === "admin") {
      rooms[roomId].adminRecorder = startAdminRecording(roomId);
    }
  });

  socket.on("getRtpCapabilities", (_, cb) => {
    cb(getRouter().rtpCapabilities);
  });

  // 🔴 Receive raw audio for admin recording (POC)
  socket.on("admin-audio", (chunk) => {
    const room = rooms[socket.roomId];
    if (room?.adminRecorder) {
      room.adminRecorder.write(Buffer.from(chunk));
    }
  });

  socket.on("disconnect", () => {
    console.log("User left");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

