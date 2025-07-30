"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PatientChat() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/doctor/patientchat/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();
      setMessages(data.messages || []);
    };

    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const res = await fetch("/api/doctor/patientchat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        sender: "patient", // ✅ DIFFERENCE!
        text: trimmed,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setInput("");
    } else {
      console.error("Failed to send message");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Patient - Doctor Chat</h1>

      <div className="border p-4 mb-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet...</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.sender === "doctor" ? "text-blue-700" : "text-green-700"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}