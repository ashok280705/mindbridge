"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

export default function PeriodTrackerCard() {
  return (
    <Link href="/mental-counselor/period-tracker">
      <div className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-purple-200 hover:border-purple-300 bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Period Tracker for Women</h3>
            </div>
          </div>
          <p className="text-gray-600 mb-4">Advanced health monitoring and cycle tracking for women's wellness</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </Link>
  );
}