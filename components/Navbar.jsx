"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
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
} from "lucide-react";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // ✅ Close dropdown on outside click
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

      {/* User Dropdown */}
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
    </motion.nav>
  );
}