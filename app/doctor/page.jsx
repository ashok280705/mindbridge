"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function DoctorDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    // 🔵 Handle new patient requests → save to state
    socket.on("new_patient_request", (data) => {
      console.log("🚨 New patient request:", data);
      setRequests((prev) => [...prev, data]);
    });

    // Example: Join a room if accepted (for demo)
    const roomId = "SOME_ROOM_ID";
    socket.emit("joinRoom", roomId);

    // Example: Send message to room
    socket.emit("sendMessage", {
      roomId,
      sender: "doctor",
      text: "Hello, I’m here to help you now!",
    });

    // 🔵 Handle incoming messages → save to state
    socket.on("receiveMessage", (msg) => {
      console.log("📨 Message in room:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">👨‍⚕️ Doctor Dashboard</h1>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Pending Patient Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No patient requests yet...</p>
        ) : (
          requests.map((req, idx) => (
            <div key={idx} className="border p-4 mb-3 rounded bg-yellow-50">
              <p><strong>Patient:</strong> {req.userName || req.userEmail}</p>
              <p><strong>Message:</strong> {req.latestMessage}</p>
            </div>
          ))
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet...</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-2 p-2 border rounded">
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </section>
    </div>
  );
}