"use client";

import { useState } from "react";
import { Mail, Lock, User, Phone, UserPlus, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful! You can now sign in.");
        // Optionally redirect to /signin
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg relative overflow-hidden animate-fade-in">
        {/* Accent */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>

        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-purple-700 w-8 h-8" />
          <h1 className="text-3xl font-extrabold text-purple-800 tracking-tight">
            Create your MindBridge Account
          </h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 transition focus-within:ring-2 focus-within:ring-purple-400">
              <User className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 transition focus-within:ring-2 focus-within:ring-purple-400">
              <Mail className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 transition focus-within:ring-2 focus-within:ring-purple-400">
              <Phone className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 transition focus-within:ring-2 focus-within:ring-purple-400">
              <Lock className="text-gray-400 w-5 h-5 mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center gap-2 py-3 rounded-lg shadow hover:shadow-xl transform hover:scale-105 transition disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-700 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
}