import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import sendWhatsApp from "@/lib/sendWhatsApp";

export async function POST(req) {
  const { message } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // ✅ System instructions moved INSIDE user content!
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a licensed mental health medical counselor AI.
Only answer medical, mental health, or emotional wellness questions.
If the question is unrelated, politely refuse.
Answer in a caring, medically safe, professional tone.
Now, here is the user's message:
"${message}"
`
            }
          ]
        }
      ],
    });

    const aiResponse = result.response.text();

    const normalized = aiResponse.toLowerCase();

    const dangerWords = [
      "suicide",
      "kill myself",
      "end my life",
      "self harm",
      "cut myself",
      "hurting myself",
      "overdose",
      "jump off",
      "hang myself",
      "worthless",
      "can’t go on",
      "no reason to live",
      "giving up",
      "nothing matters",
      "want to die",
      "die alone",
      "die tonight",
      "goodbye forever",
    ];

    const dangerPatterns = [
      /kill\s+myself/,
      /end\s+my\s+life/,
      /self[-\s]?harm/,
      /cut\s+myself/,
      /i\s+want\s+to\s+die/,
      /jump\s+off/,
      /hang\s+myself/,
      /goodbye forever/,
      /worthless/,
      /can'?t go on/,
      /giving up/,
      /overdose/,
    ];

    const flagged =
      dangerWords.some((w) => normalized.includes(w)) ||
      dangerPatterns.some((p) => p.test(normalized));

    // ✅ Use a second pass AI check
    const safetyCheck = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a mental health risk detector. Reply ONLY "YES" if the text indicates any self-harm or suicide risk, otherwise reply "NO".
Check this message:
"${message}"
`
            }
          ]
        }
      ],
    });

    const aiThinksRisk = safetyCheck.response.text().toLowerCase().includes("yes");

    if (flagged || aiThinksRisk) {
      await dbConnect();
      const user = await User.findOne(); // Replace with real user logic
      if (user?.emergency) {
        await sendWhatsApp(
          user.emergency,
          "🚨 URGENT: Your sibling may be experiencing a severe mental health crisis and might be in danger of self-harm. Please check on them immediately."
        );
      }
    }

    return new Response(JSON.stringify({ reply: aiResponse }), { status: 200 });
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}