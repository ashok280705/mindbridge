// ✅ File: app/api/counselor/chat/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import sendWhatsApp from "@/lib/sendWhatsApp";

export async function POST(req) {
  const { message, email } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required." }), {
      status: 400,
    });
  }

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required." }), {
      status: 400,
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // ✅ 1️⃣ Generate AI reply
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a licensed mental health counselor AI.
Only answer mental health questions.
If the question is unrelated, politely refuse.
Answer kindly, safely, and professionally.
Here is the user message:
"${message}"
`
            }
          ]
        }
      ],
    });

    const aiResponse = result.response.text();
    const normalized = aiResponse.toLowerCase();

    // ✅ 2️⃣ Comprehensive danger words & regex patterns
    const dangerWords = [
      "suicide", "kill myself", "end my life", "self harm", "self-harm",
      "cut myself", "cutting", "overdose", "hurt myself", "hurting myself",
      "die", "jump off", "jumping off", "hang myself", "hanging myself",
      "worthless", "can't go on", "cant go on", "no reason to live",
      "giving up", "nothing matters", "want to die", "want to disappear",
      "goodbye forever", "leave forever", "ending it", "end it all",
      "ending everything", "take my life", "ending myself", "no hope",
      "nobody cares", "no one cares", "unlive", "unalive", "unaliving",
      "end everything"
    ];

    const dangerPatterns = [
      /\bkill\s+(myself|me)\b/i,
      /\bend\s+(my\s+life|it\s+all|everything)\b/i,
      /\bself[-\s]?harm\b/i,
      /\bcut\s+(myself|me)\b/i,
      /\bcutting\b/i,
      /\boverdose\b/i,
      /\bhurt(ing)?\s+(myself|me)\b/i,
      /\bjump(ing)?\s+off\b/i,
      /\bhang(ing)?\s+(myself|me)\b/i,
      /\bworthless\b/i,
      /\b(can'?t|cant)\s+go\s+on\b/i,
      /\bno\s+reason\s+to\s+live\b/i,
      /\bgiving\s+up\b/i,
      /\bnothing\s+matters\b/i,
      /\bi\s+want\s+to\s+(die|disappear|end it all|leave forever)\b/i,
      /\bgoodbye forever\b/i,
      /\bend(ing)?\s+it\s+all\b/i,
      /\bend(ing)?\s+everything\b/i,
      /\btake\s+my\s+life\b/i,
      /\bend(ing)?\s+myself\b/i,
      /\bno\s+hope\b/i,
      /\bnobody cares\b/i,
      /\bno one cares\b/i,
      /\bunalive\b/i,
      /\bunaliving\b/i,
      /\bunlive\b/i,
    ];

    const flagged =
      dangerWords.some((w) => normalized.includes(w)) ||
      dangerPatterns.some((p) => p.test(message.toLowerCase()));

    console.log("✅ flagged:", flagged);

    // ✅ 3️⃣ Second AI risk check
    let aiThinksRisk = false;
    try {
      const safetyCheck = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are a mental health risk detector.
Reply ONLY "YES" if the text indicates any self-harm or suicide risk, otherwise reply "NO".
Message:
"${message}"
`
              }
            ]
          }
        ],
      });

      const check = safetyCheck.response.text().trim().toLowerCase();
      aiThinksRisk = check.includes("yes");
      console.log("✅ aiThinksRisk:", aiThinksRisk);
    } catch (safetyError) {
      console.warn("⚠️ Risk check failed:", safetyError);
    }

    if (flagged || aiThinksRisk) {
      console.log("⚠️ Risk detected → contacting emergency...");

      await dbConnect();
      const user = await User.findOne({ email });

      console.log("✅ Fetched user:", user);

      if (user?.emergency) {
        console.log("✅ Sending WhatsApp to:", user.emergency);
        try {
          await sendWhatsApp(
            user.emergency,
            `🚨 URGENT: ${
              user.name || "Your family member"
            } may be in a mental health crisis. Please check on them immediately.`
          );
          console.log("✅ WhatsApp sent!");
        } catch (err) {
          console.error("❌ WhatsApp failed:", err);
        }
      } else {
        console.warn("⚠️ No emergency contact saved for user!");
      }
    }

    return new Response(JSON.stringify({ reply: aiResponse }), { status: 200 });

  } catch (error) {
    console.error("❌ Gemini API error:", error);

    if (error.status === 503) {
      return new Response(
        JSON.stringify({ error: "The AI model is overloaded. Please try again shortly." }),
        { status: 503 }
      );
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}