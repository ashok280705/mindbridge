import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const isGoogle = searchParams.get("isGoogle") === "true";

  await dbConnect();

  let user;

  if (isGoogle) {
    user = await User.findOne({ googleId: userId });
  } else {
    user = await User.findById(userId);
  }

  const complete = user?.phone && user?.emergency;
  return new Response(JSON.stringify({ profileComplete: !!complete }));
}

export async function POST(req) {
  const { userId, phone, emergency, isGoogle } = await req.json();
  await dbConnect();

  if (isGoogle) {
    await User.findOneAndUpdate({ googleId: userId }, { phone, emergency });
  } else {
    await User.findByIdAndUpdate(userId, { phone, emergency });
  }

  return new Response(JSON.stringify({ ok: true }));
}