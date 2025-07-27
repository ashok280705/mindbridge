"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

export default function DoctorNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleDoctorSignOut = async () => {
    try {
      // ✅ Hit status API with PUT
      await fetch("/api/doctor/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, status: "offline" }),
      });

      // ✅ Now sign out with redirect to login
      await signOut({ callbackUrl: "/login" });
    } catch (err) {
      console.error("Failed to update doctor status:", err);
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 px-8 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Stethoscope className="w-7 h-7 text-purple-700" />
        <Link href="/dashboard-doctor" className="text-xl font-bold text-purple-700">
          Doctor Dashboard
        </Link>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 text-gray-700 hover:text-purple-700 transition"
        >
          <User className="w-5 h-5" />
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <Link
                href="/doctor/profile"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-purple-50"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" /> Profile
              </Link>

              <button
                onClick={handleDoctorSignOut}
                className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}