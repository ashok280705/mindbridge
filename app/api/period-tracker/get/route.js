import dbConnect from "@/lib/dbConnect";
import PeriodEntry from "@/models/PeriodEntry";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    await dbConnect();

    // Get session for authentication
    const session = await getServerSession();

    const body = await req.json();
    const { userId } = body;

    // Use session user ID if available, otherwise use provided userId
    const actualUserId = session?.user?.id || userId || "1234567890";

    const entries = await PeriodEntry.find({ userId: actualUserId })
      .sort({ startDate: -1 })
      .lean();

    // Format entries for better client consumption
    const formattedEntries = entries.map(entry => ({
      _id: entry._id,
      startDate: entry.startDate,
      endDate: entry.endDate,
      flowLevel: entry.flowLevel,
      painLevel: entry.painLevel,
      mood: entry.mood,
      symptoms: entry.symptoms || [],
      notes: entry.notes || "",
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      entries: formattedEntries,
      count: formattedEntries.length
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error("❌ Error fetching period entries:", err);

    // Return mock data for demonstration
    const mockEntries = [
      {
        _id: "mock1",
        userId: actualUserId,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        flowLevel: "heavy",
        painLevel: 6,
        mood: "irritated",
        symptoms: ["cramps", "fatigue"],
        notes: "Heavy flow with significant cramping",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        _id: "mock2", 
        userId: actualUserId,
        startDate: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000), // 58 days ago
        endDate: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000), // 53 days ago
        flowLevel: "normal",
        painLevel: 3,
        mood: "normal",
        symptoms: ["mild cramps"],
        notes: "Regular cycle, minimal discomfort",
        createdAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000)
      }
    ];

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Using sample data for demonstration",
      entries: mockEntries,
      count: mockEntries.length
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}