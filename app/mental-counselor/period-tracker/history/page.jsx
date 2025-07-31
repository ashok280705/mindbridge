
"use client";

import { useEffect, useState } from "react";
import PeriodHistory from "@/components/PeriodTracker/PeriodHistory";
import { ArrowLeft, RefreshCw, Plus } from "lucide-react";
import Link from "next/link";

export default function PeriodHistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use localStorage directly to avoid import issues
      const PERIOD_STORAGE_KEY = 'mindbridge_period_entries';
      let localEntries = [];
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(PERIOD_STORAGE_KEY);
        localEntries = stored ? JSON.parse(stored) : [];
      }
      
      setEntries(localEntries.reverse()); // Show newest first
    } catch (err) {
      setError("Error loading entries from local storage");
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-64">
          <div className="flex items-center gap-3 text-pink-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Loading your period history...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-600 text-lg font-medium mb-4">Error: {error}</div>
          <button
            onClick={fetchEntries}
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/mental-counselor/period-tracker"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Period History</h1>
            <p className="text-gray-600">
              {entries.length > 0 
                ? `Showing ${entries.length} period ${entries.length === 1 ? 'entry' : 'entries'}`
                : "No entries found"
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchEntries}
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <Link 
              href="/mental-counselor/period-tracker/add"
              className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </Link>
          </div>
        </div>
      </div>

      {/* Period History Table */}
      <PeriodHistory entries={entries} />

      {/* Summary Stats */}
      {entries.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Total Entries</h3>
            <p className="text-3xl font-bold text-pink-600">{entries.length}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Latest Entry</h3>
            <p className="text-lg font-bold text-purple-600">
              {new Date(entries[0]?.startDate).toLocaleDateString() || 'No data'}
            </p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Avg Pain Level</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {entries.length > 0 
                ? (entries.reduce((sum, entry) => sum + (entry.painLevel || 0), 0) / entries.length).toFixed(1)
                : '0'
              }/10
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
