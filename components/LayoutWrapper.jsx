"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide Navbar & Footer on these pages
  const hideLayout =
    pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/Doctor" || pathname === "/register-doctor";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900">
      {/* Only show Navbar if not hidden */}
      {!hideLayout && (
        <header className="sticky top-0 z-50 shadow bg-white">
          <Navbar />
        </header>
      )}

      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Only show Footer if not hidden */}
      {!hideLayout && (
        <footer className="bg-white shadow-inner ">
          <Footer />
        </footer>
      )}
    </div>
  );
}