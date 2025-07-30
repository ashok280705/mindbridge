import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";
import User from "@/models/User";

export async function POST(req) {
  try {
    // 1️⃣ Parse incoming JSON
    const body = await req.json();
    const { userId, startDate, endDate, flowLevel, painLevel, mood, symptoms, notes } = body;

    // 2️⃣ Validate required fields
    if (!userId || !startDate) {
      return new Response(JSON.stringify({ error: "Missing required fields: userId or startDate" }), {
        status: 400,
      });
    }

    // 3️⃣ Connect to DB
    await dbConnect();

    // 4️⃣ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // 5️⃣ Create new PeriodEntry
    const entry = new PeriodEntry({
      userId,
      startDate,
      endDate,
      flowLevel,
      painLevel,
      mood,
      symptoms,
      notes,
    });

    await entry.save();

    return new Response(JSON.stringify({ success: true, entry }), { status: 201 });
  } catch (err) {
    console.error("❌ Error creating period entry:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}