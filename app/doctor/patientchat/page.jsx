"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function ChatRoom({ params }) {
  const roomId = params.roomId;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io();

    socket.emit("joinRoom", roomId);

    socket.on("roomMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      roomId,
      sender: "doctor",
      text: input,
    };

    socket.emit("roomMessage", msg);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl mb-4 font-bold">Room: {roomId}</h1>

      <div className="border p-4 mb-4 h-96 overflow-y-auto bg-white rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.sender === "doctor" ? "bg-blue-100 text-right" : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-indigo-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}