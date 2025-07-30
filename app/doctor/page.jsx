"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export default function DoctorDashboardPage() {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    // Doctor listens for new patient requests
    socket.on("new_patient_request", (data) => {
      console.log("🚨 New patient request:", data);
      // You can show a notification or auto-join, etc.
    });

    // Example: Join a room if accepted
    const roomId = "SOME_ROOM_ID";
    socket.emit("joinRoom", roomId);

    // Example: Send message to room
    socket.emit("sendMessage", {
      roomId,
      sender: "doctor",
      text: "Hello, I’m here to help you now!",
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      console.log("📨 Message in room:", msg);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">👨‍⚕️ Doctor Dashboard</h1>
      <p className="mt-4 text-gray-600">Listening for patient requests and messages...</p>
    </div>
  );
}