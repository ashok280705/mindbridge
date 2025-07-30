import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import CounselorMessage from "@/models/CounselorMessage";
import Room from "@/models/Room";
import sendWhatsApp from "@/lib/sendWhatsApp";

export async function POST(req) {
  const { message, email, lang } = await req.json();

  if (!message || !email) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are an empathetic mental health counselor.

Instructions:
- Respond with care and warmth.
- Use short, supportive sentences.
- Add a gentle emotional touch to every line.
- Keep response under 3 sentences.
- User said: "${message}"
            `.trim(),
          },
        ],
      },
    ],
  });

  const aiResponse = result.response.text();
  const normalized = aiResponse.toLowerCase();
  const dangerWords = ["suicide", "kill myself", "end my life", "self harm", "unalive"];
  const flagged = dangerWords.some(
    (w) => normalized.includes(w) || message.toLowerCase().includes(w)
  );

  let room = await Room.findOne({ user: user._id, status: "pending" });
  if (!room) {
    room = await Room.create({
      user: user._id,
      counselorMessages: [],
      doctorPatientMessages: [],
      dangerCount: 0,
    });
  }

  if (!room.counselorMessages) room.counselorMessages = [];

  const userMsg = await CounselorMessage.create({
    room: room._id,
    user: user._id,
    sender: "user",
    text: message,
  });

  const aiMsg = await CounselorMessage.create({
    room: room._id,
    sender: "ai",
    text: aiResponse,
  });

  room.counselorMessages.push(userMsg._id, aiMsg._id);
  if (flagged) room.dangerCount += 1;

  await room.save();

  if (flagged && global._io) {
    global._io.emit("new_patient_request", {
      roomId: room._id.toString(),
      userEmail: user.email,
      latestMessage: message,
    });
  }

  return new Response(JSON.stringify({ reply: aiResponse }), { status: 200 });
}