import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";

export async function POST(req) {
  await dbConnect();
  const { entryId, updates } = await req.json();

  const entry = await PeriodEntry.findByIdAndUpdate(entryId, updates, { new: true });

  return new Response(JSON.stringify({ success: true, entry }), { status: 200 });
}