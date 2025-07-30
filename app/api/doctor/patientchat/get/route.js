import dbConnect from "@/lib/dbConnect";
import DoctorPatientMessage from "@/models/DoctorPatientMessage";

export async function POST(req) {
  const { roomId } = await req.json();
  if (!roomId) {
    return new Response(JSON.stringify({ error: "Missing roomId" }), { status: 400 });
  }

  await dbConnect();
  const messages = await DoctorPatientMessage.find({ room: roomId }).sort({ createdAt: 1 });

  return new Response(JSON.stringify({ messages }), { status: 200 });
}