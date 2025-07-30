import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";

export async function POST(req) {
  await dbConnect();
  const { entryId } = await req.json();

  await PeriodEntry.findByIdAndDelete(entryId);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}