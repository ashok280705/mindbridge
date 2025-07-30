// ✅ app/api/doctor/reject-request/route.js
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";

export async function POST(req) {
  const { roomId } = await req.json();
  await dbConnect();

  const room = await Room.findById(roomId);
  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  room.status = "rejected";
  await room.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}