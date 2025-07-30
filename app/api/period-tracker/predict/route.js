import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";
import { predictNextCycle } from "@/lib/predictCycle";

export async function POST(req) {
  await dbConnect();
  const { userId } = await req.json();

  const entries = await PeriodEntry.find({ userId });

  const prediction = predictNextCycle(entries);

  return new Response(JSON.stringify({ success: true, prediction }), {
    status: 200,
  });
}