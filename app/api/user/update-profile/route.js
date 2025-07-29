// ✅ File: app/api/user/update-profile/route.js

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      userId,
      isGoogle,
      phone,
      emergency,
      birthdate,
      gender,
    } = body;

    const filter = isGoogle ? { googleId: userId } : { _id: userId };

    const update = {
      phone,
      emergency,
      gender: gender || null,
      // ✅ Always cast birthdate to Date if valid:
      birthdate: birthdate ? new Date(birthdate) : null,
    };

    const user = await User.findOneAndUpdate(filter, update, { new: true });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}