"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MentalCounselorPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;

    const check = async () => {
      const isGoogle = !!session.user.googleId;
      const userId = session.user.googleId || session.user.id;

      const res = await fetch(
        `/api/counselor/update-profile?userId=${userId}&isGoogle=${isGoogle}`
      );
      const { profileComplete } = await res.json();

      if (profileComplete) {
        router.push("/mental-counselor/Chat");
      } else {
        router.push("/mental-counselor/ProfileForm");
      }
    };

    check();
  }, [session]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="animate-pulse text-blue-600 font-bold text-xl">
        Preparing your counseling session...
      </p>
    </main>
  );
}