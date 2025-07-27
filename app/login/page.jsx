"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  LogIn,
  ShieldCheck,
  Fingerprint,
  User,
  Stethoscope,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        isDoctor: isDoctor.toString(), // ✅ pass flag
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // ✅ If doctor, update status online
        if (isDoctor) {
          await fetch("/api/doctor/status", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, status: "online" }),
          });
        }

        router.push(isDoctor ? "/doctor" : "/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isDoctor) {
      setError("Doctors must use email & password only.");
      return;
    }
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg relative overflow-hidden animate-fade-in">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>

        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-blue-700 w-8 h-8" />
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
            MindBridge Login
          </h1>
        </div>

        {/* Toggle: User vs Doctor */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setIsDoctor(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              !isDoctor
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-50"
            } transition`}
          >
            <User className="w-4 h-4" /> User
          </button>
          <button
            type="button"
            onClick={() => setIsDoctor(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isDoctor
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-purple-50"
            } transition`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
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
            <label className="block text-gray-600 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
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

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 py-3 rounded-lg shadow hover:shadow-xl transform hover:scale-105 transition disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading
              ? isDoctor
                ? "Logging in Doctor..."
                : "Logging in..."
              : isDoctor
              ? "Doctor Login"
              : "Login"}
          </button>
        </form>

        {!isDoctor ? (
          <>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
              >
                <Fingerprint className="w-5 h-5 text-red-500" />
                Login with Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-700 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </>
        ) : (
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have a doctor account?{" "}
            <a
              href="/register-doctor"
              className="text-blue-700 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
