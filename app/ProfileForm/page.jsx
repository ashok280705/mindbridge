"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProfileFormPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirectTo") || "/mental-counselor";

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch(
            `/api/user/get-profile?email=${encodeURIComponent(
              session.user.email
            )}`
          );
          if (res.ok) {
            const { user } = await res.json();
            console.log("✅ User:", user);

            if (user.phone) setPhone(user.phone);
            if (user.emergency) setEmergency(user.emergency);
            if (user.birthdate) {
              const dateOnly = new Date(user.birthdate).toISOString().slice(0, 10);
              setBirthdate(dateOnly);
            }
            if (user.gender) setGender(user.gender);
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
    };

    fetchProfile();
  }, [session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isGoogle = !!session.user.googleId;

    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.googleId || session.user.id,
        phone,
        emergency,
        birthdate,
        gender,
        isGoogle,
      }),
    });

    if (res.ok) {
      router.push(redirectTo);
    } else {
      console.error("❌ Failed to update profile");
    }

    setLoading(false);
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-indigo-600 font-semibold animate-pulse">
          Loading profile...
        </p>
      </main>
    );
  }

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

        <div>
          <label className="block mb-2 text-sm">Birthdate</label>
          <input
            type="date"
            required
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Gender</label>
          <select
            required
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded font-semibold"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </main>
  );
}