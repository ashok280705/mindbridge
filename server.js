import { createServer } from "http";
import next from "next";
import mongoose from "mongoose";
import { initIO } from "./lib/socket.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mindbridge";

mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => console.error(err));

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  const io = initIO(server);
  global._io = io;

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", (msg) => {
      console.log("💬 New message:", msg);
      io.to(msg.roomId).emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`✅ Ready on http://localhost:${port}`);
  });
});