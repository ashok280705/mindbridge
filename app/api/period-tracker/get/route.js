import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";

export async function POST(req) {
  await dbConnect();
  const { userId } = await req.json();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }

  const entries = await PeriodEntry.find({ userId }).sort({ startDate: -1 });

  return new Response(JSON.stringify({ success: true, entries }), { status: 200 });
}