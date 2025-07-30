import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomId, doctorId, accept } = req.body;

  await dbConnect();

  const room = await Room.findById(roomId);

  if (!room) return res.status(404).json({ error: "Room not found" });

  if (accept) {
    room.status = "accepted";
    room.doctor = doctorId;
  } else {
    room.status = "rejected";
  }

  await room.save();

  return res.status(200).json({ success: true });
}