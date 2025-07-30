import { Server } from "socket.io";

let io;

export function initIO(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    console.log("✅ Socket.IO initialized");
  }
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialized yet!");
  return io;
}