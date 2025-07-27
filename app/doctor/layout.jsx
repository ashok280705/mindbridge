"use client";

import DoctorNavbar from "@/components/DocNavbar";

export default function DoctorLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Persistent doctor navbar */}
      <DoctorNavbar />

      {/* ✅ Main content with top padding to clear fixed navbar */}
      <main className="flex-1 pt-20 px-6 bg-gray-50">
        {children}
      </main>

      {/* ✅ Optional footer for doctor dashboard */}
      {/* <footer className="bg-white text-center py-4 border-t">
        &copy; {new Date().getFullYear()} MindBridge · Doctor Panel
      </footer> */}
    </div>
  );
}