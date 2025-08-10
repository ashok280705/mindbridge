"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  LogIn,
  ShieldCheck,
  Fingerprint,
  User,
  Stethoscope,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    // Animate elements on mount
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.opacity = '1';
        titleRef.current.style.transform = 'translateY(0)';
      }
    }, 200);
    
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.style.opacity = '1';
        formRef.current.style.transform = 'translateY(0)';
      }
    }, 400);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        isDoctor: isDoctor.toString(),
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
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

  if (!mounted) return null;

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(3deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
          75% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.3); }
          50% { box-shadow: 0 0 30px rgba(167, 139, 250, 0.6); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .floating-shape {
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-shape:nth-child(2) {
          animation-delay: -2s;
          animation-duration: 8s;
        }
        
        .floating-shape:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 7s;
        }
        
        .floating-shape:nth-child(4) {
          animation-delay: -1s;
          animation-duration: 9s;
        }
        
        .sparkle-animation {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .sparkle-animation:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        .sparkle-animation:nth-child(3) {
          animation-delay: 1s;
        }
        
        .gradient-bg {
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .animate-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .input-focus:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .mental-health-icon {
          color: #8b5cf6;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.3));
        }
      `}</style>

      <main className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="floating-shape absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-sm"></div>
        <div className="floating-shape absolute top-40 right-20 w-16 h-16 bg-purple-300/20 rounded-full blur-sm"></div>
        <div className="floating-shape absolute bottom-32 left-20 w-24 h-24 bg-pink-300/15 rounded-full blur-sm"></div>
        <div className="floating-shape absolute bottom-20 right-10 w-18 h-18 bg-blue-300/20 rounded-full blur-sm"></div>

        {/* Sparkle Effects */}
        <div className="absolute top-1/4 left-1/4">
          <Sparkles className="sparkle-animation w-4 h-4 text-white/60" />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <Sparkles className="sparkle-animation w-3 h-3 text-purple-200/70" />
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <Sparkles className="sparkle-animation w-5 h-5 text-pink-200/60" />
        </div>

        {/* Main Login Container */}
        <div className="glass-effect rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl">
          {/* Header */}
          <div 
            ref={titleRef}
            className="animate-in text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Brain className="mental-health-icon w-10 h-10" />
                <Heart className="absolute -top-1 -right-1 w-6 h-6 text-pink-500" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MindCare
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Your safe space for mental wellness
            </p>
          </div>

          <div 
            ref={formRef}
            className="animate-in"
          >
            {/* User Type Toggle */}
            <div className="flex items-center justify-center gap-2 mb-8 p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setIsDoctor(false)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  !isDoctor
                    ? "bg-white text-purple-600 shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <User className="w-4 h-4" />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setIsDoctor(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDoctor
                    ? "bg-white text-purple-600 shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Doctor
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <div className="input-focus relative border-2 border-gray-200 rounded-2xl px-4 py-4 focus-within:border-purple-400 transition-all duration-300">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <div className="input-focus relative border-2 border-gray-200 rounded-2xl px-4 py-4 focus-within:border-purple-400 transition-all duration-300">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center animate-pulse">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-hover w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center gap-3 py-4 rounded-2xl shadow-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {loading
                  ? "Signing In..."
                  : isDoctor
                  ? "Sign In as Doctor"
                  : "Sign In"}
              </button>
            </form>

            {/* Google Login for Patients Only */}
            {!isDoctor && (
              <>
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-3 text-gray-500 text-sm">or continue with</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn-hover w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-4 px-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium text-gray-700"
                >
                  <Fingerprint className="w-5 h-5 text-red-500" />
                  Continue with Google
                </button>
              </>
            )}

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-8">
              {isDoctor ? "New doctor?" : "Don't have an account?"}{" "}
              <a
                href={isDoctor ? "/register-doctor" : "/signup"}
                className="text-purple-600 font-semibold hover:text-purple-800 transition-colors duration-200 hover:underline"
              >
                {isDoctor ? "Register here" : "Create account"}
              </a>
            </p>

            {/* Mental Health Message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <p className="text-center text-sm text-gray-600">
                <Heart className="inline w-4 h-4 text-pink-500 mr-1" />
                Your mental health journey starts here. You're not alone.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent"></div>
      </main>
    </>
  );
}