import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId, startDate, endDate,
      flowLevel, painLevel, mood, symptoms, notes
    } = body;

    if (!userId || !startDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    await dbConnect();

    let user;

    // ✅ If userId is valid ObjectId, find by _id, else try googleId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ googleId: userId });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const entry = new PeriodEntry({
      userId: user._id,  // ✅ Save real Mongo _id
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