// ✅ File: /app/api/doctor/accept-request/route.js

import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Doctor from "@/models/Doctor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ✅ next-auth config
import "@/lib/socket"; // ✅ Make sure this runs ONCE to attach global._io

export async function POST(req) {
  try {
    const { roomId } = await req.json();
    if (!roomId) {
      return new Response(JSON.stringify({ error: "Missing roomId" }), { status: 400 });
    }

    await dbConnect();

    // ✅ Get session from next-auth
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    // ✅ Find doctor by session user email
    const doctor = await Doctor.findOne({ email: session.user.email });

    if (!doctor) {
      return new Response(JSON.stringify({ error: "Doctor not found" }), { status: 404 });
    }

    // ✅ Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
    }

    // ✅ Update the room
    room.doctor = doctor._id;
    room.status = "accepted";
    await room.save();

    // ✅ Emit to Socket.IO server
    if (global._io) {
      global._io.emit("roomAccepted", { roomId });
    } else {
      console.warn("⚠️ global._io is undefined! Make sure your socket server is running.");
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Error in accept-request:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}