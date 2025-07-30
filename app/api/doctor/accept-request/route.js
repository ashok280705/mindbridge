// ✅ app/api/doctor/accept-request/route.js
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Doctor from "@/models/Doctor";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const { roomId } = await req.json();
  await dbConnect();

  const doctor = await Doctor.findOne({ /* here link with session doctor if using next-auth */ });

  if (!doctor) {
    return new Response(JSON.stringify({ error: "Doctor not found" }), { status: 401 });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  room.doctor = doctor._id;
  room.status = "accepted";
  await room.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}