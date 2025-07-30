"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function DoctorDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("new_patient_request", (data) => {
      console.log("🚨 New patient request:", data);
      setRequests((prev) => [...prev, data]);
    });

    newSocket.on("receiveMessage", (msg) => {
      console.log("📨 Message in room:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, []);

  const acceptRequest = async (req) => {
    if (!socket) return;

    try {
      const res = await fetch("/api/doctor/accept-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: req.roomId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Accept failed:", err);
        return;
      }

      // ✅ Notify patient via socket
      socket.emit("roomAccepted", {
        roomId: req.roomId,
        userEmail: req.userEmail,
      });

      // ✅ Join room socket
      socket.emit("joinRoom", req.roomId);

      // ✅ Go to chat
      router.push(`/doctor/patientchat/${req.roomId}`);
    } catch (error) {
      console.error("❌ Error in acceptRequest:", error);
    }
  };

  const rejectRequest = async (req) => {
    if (!socket) return;

    try {
      const res = await fetch("/api/doctor/reject-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: req.roomId }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Reject failed:", err);
        return;
      }

      socket.emit("roomRejected", {
        roomId: req.roomId,
        userEmail: req.userEmail,
      });

      setRequests((prev) => prev.filter((r) => r.roomId !== req.roomId));
    } catch (error) {
      console.error("❌ Error in rejectRequest:", error);
    }
  };

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
              <p>
                <strong>Patient:</strong> {req.userName || req.userEmail}
              </p>
              <p>
                <strong>Message:</strong> {req.latestMessage}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => acceptRequest(req)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(req)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}