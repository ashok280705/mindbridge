import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  const { roomId } = params;
  await dbConnect();

  const room = await Room.findById(roomId).populate("messages");
  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ messages: room.messages }), { status: 200 });
}

export async function POST(req, { params }) {
  const { roomId } = params;
  const { text, sender } = await req.json();

  if (!text || !sender) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  await dbConnect();
  const room = await Room.findById(roomId);
  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
  }

  const newMessage = await Message.create({
    room: room._id,
    sender,
    text,
  });

  room.messages.push(newMessage._id);
  room.lastMessage = text;
  await room.save();

  return new Response(JSON.stringify(newMessage), { status: 200 });
}