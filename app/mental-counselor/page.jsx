"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  CalendarHeart,
  UsersRound,
  Star,
  MessageSquareHeart,
  ArrowRight,
} from "lucide-react";

export default function MentalCounselorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    const checkProfile = async () => {
      const userEmail = session?.user?.email;

      if (!userEmail) {
        console.error("❌ No user email found in session");
        return;
      }

      try {
        // ✅ Make sure your folder is app/api/user/get-profile/route.js
        const res = await fetch(
          `/api/user/get-profile?email=${encodeURIComponent(userEmail)}`
        );

        if (!res.ok) {
          console.error(`❌ API failed: ${res.status}`);
          return;
        }

        const { user } = await res.json();

        console.log("✅ Fetched user:", user);

        if (
          !user?.phone ||
          !user?.emergency ||
          !user?.birthdate ||
          !user?.gender
        ) {
          console.log("⚠️ Profile incomplete → redirecting to ProfileForm");
          router.push(
            `/ProfileForm?redirectTo=${encodeURIComponent("/mental-counselor")}`
          );
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error("❌ Error checking profile:", err);
      }
    };

    checkProfile();
  }, [session, status, router]);

  if (status === "loading" || checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-indigo-600 font-semibold animate-pulse">
          Checking your profile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 md:px-6 py-20 mt-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Personal Mental Wellness Hub 🌿
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Track your well-being, join supportive communities & talk to your AI
            counselor — all in one safe space.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Mental Counselor */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="group bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mental Counselor
              </h2>
              <p className="text-gray-600 mb-8">
                Private AI sessions to share your thoughts & receive mental
                health support.
              </p>
              <Link href="/mental-counselor/AiSession/Chat">
                <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                  <MessageSquareHeart className="w-5 h-5" />
                  <span>Start Session</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          </motion.div>

          {/* Period Tracker */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="group bg-white rounded-3xl shadow-xl border border-pink-200 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center">
                <CalendarHeart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Period Cycle Tracker
              </h2>
              <p className="text-gray-600 mb-8">
                Manage your menstrual cycle, get reminders, and health tips
                designed just for you.
              </p>
              <Link href="/mental-counselor/PeriodTracker">
                <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                  <CalendarHeart className="w-5 h-5" />
                  <span>Track Cycle</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <div className="h-2 bg-gradient-to-r from-pink-500 to-pink-600"></div>
          </motion.div>

          {/* Community */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="group bg-white rounded-3xl shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center">
                <UsersRound className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Community Q&A & Reviews
              </h2>
              <p className="text-gray-600 mb-8">
                Ask questions, share stories & find trusted mental health
                insights, like Glassdoor for your mind.
              </p>
              <Link href="/mental-counselor/Community">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Join Community</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}