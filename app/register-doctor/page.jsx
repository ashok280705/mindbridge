"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterDoctor() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/doctor/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Doctor registered! Now login.");
      router.push("/login");
    } else {
      alert("Error registering doctor.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-8 rounded-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-purple-700">Doctor Registration</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Medical License Number"
          value={form.licenseNumber}
          onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Specialization (optional)"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded"
        >
          Register Doctor
        </button>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-700 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </form>
      
    </main>
  );
}