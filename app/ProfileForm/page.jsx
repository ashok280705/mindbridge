"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isGoogle = !!session.user.googleId;

    const res = await fetch("/api/counselor/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.googleId || session.user.id,
        phone,
        emergency,
        isGoogle,
      }),
    });

    if (res.ok) {
      router.push("/mental-counselor/Chat");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md space-y-6 animate-fade-in"
      >
        <h1 className="text-2xl font-bold text-center">Complete Your Profile</h1>

        <div>
          <label className="block mb-2 text-sm">Phone Number</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-4 py-2"
            placeholder="Enter your phone"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Emergency Contact</label>
          <input
            required
            value={emergency}
            onChange={(e) => setEmergency(e.target.value)}
            className="w-full border rounded px-4 py-2"
            placeholder="Emergency contact number"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded font-semibold"
        >
          {loading ? "Saving..." : "Save & Start"}
        </button>
      </form>
    </main>
  );
}