import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import DoctorPatientMessage from "@/models/DoctorPatientMessage";

export async function POST(req) {
  const { roomId, sender, text } = await req.json();
  if (!roomId || !sender || !text) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  await dbConnect();
  const room = await Room.findById(roomId);
  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  const msg = await DoctorPatientMessage.create({
    room: room._id,
    sender,
    text,
  });

  room.doctorPatientMessages.push(msg._id);
  await room.save();

  return new Response(JSON.stringify({ success: true, message: msg }), { status: 200 });
}