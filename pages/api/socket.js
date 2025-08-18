import { Server } from "socket.io";
//now the function works correctlu and more efficiently
export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 New Socket.io server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      // Join room
      socket.on("joinRoom", ({ roomId }) => {
        socket.join(roomId);
        console.log(`🔒 Socket ${socket.id} joined room ${roomId}`);
      });

      // Relay messages
      socket.on("chatMessage", ({ roomId, message }) => {
        socket.to(roomId).emit("chatMessage", message);
      });

      // Doctor accepts room
      socket.on("acceptRoom", ({ roomId, doctorId }) => {
        socket.to(roomId).emit("roomAccepted", { doctorId });
      });

      // Doctor rejects room
      socket.on("rejectRoom", ({ roomId }) => {
        socket.to(roomId).emit("roomRejected");
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}