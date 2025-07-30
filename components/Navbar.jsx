"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  MessageCircle,
  FileText,
  ShoppingBag,
  LayoutDashboard,
  ChevronDown,
  User,
  LogOut,
  Mail,
  Bell,
} from "lucide-react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const router = useRouter();

  // 👉 TEMPORARY: Replace with `useSession` or user context!
  const [role, setRole] = useState("patient"); // 'doctor' or 'patient'

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotif = () => setNotifOpen(!notifOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO");
    });

    socket.on("roomAccepted", ({ roomId }) => {
      console.log("🔔 New room accepted:", roomId);
      setNotifications((prev) => [...prev, { type: "accepted", roomId }]);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
    setDropdownOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 px-8 flex items-center justify-between"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Brain className="w-7 h-7 text-purple-700" />
        <Link href="/" className="text-xl font-bold text-purple-700">
          MindBridge
        </Link>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/chat"
          className="flex items-center gap-1 text-gray-700 hover:text-purple-700 transition"
        >
          <MessageCircle className="w-5 h-5" /> Talk Now
        </Link>

        <Link
          href="/reports"
          className="flex items-center gap-1 text-gray-700 hover:text-purple-700 transition"
        >
          <FileText className="w-5 h-5" /> Analyzer
        </Link>

        <Link
          href="/pharmacy"
          className="flex items-center gap-1 text-gray-700 hover:text-purple-700 transition"
        >
          <ShoppingBag className="w-5 h-5" /> Pharmacy
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-gray-700 hover:text-purple-700 transition"
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotif}
            className="relative focus:outline-none"
          >
            <Bell className="w-6 h-6 text-gray-700 hover:text-purple-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n, i) => (
                      <div
                        key={i}
                        className="mb-3 p-3 border rounded bg-green-50"
                      >
                        {n.type === "accepted" && (
                          <>
                            <p className="text-green-700 font-medium">
                              ✅ Your request was accepted!
                            </p>
                            <button
                              onClick={() => {
                                if (role === "doctor") {
                                  router.push(
                                    `/doctor/patientchat/${n.roomId}`
                                  );
                                } else {
                                  router.push(`/chat/${n.roomId}`);
                                }
                                setNotifOpen(false);
                              }}
                              className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                            >
                              Chat Now
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
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
                  href="/ProfileForm"
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-purple-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" /> Profile
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-purple-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Mail className="w-4 h-4" /> Contact Us
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}