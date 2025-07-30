"use client";

import { useEffect, useState } from "react";
import PeriodHistory from "@/components/PeriodTracker/PeriodHistory";

export default function PeriodHistoryPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const res = await fetch("/api/period-tracker/get", {
        method: "POST",
        body: JSON.stringify({ userId: "1234567890" }),
      });
      const data = await res.json();
      setEntries(data.entries || []);
    };
    fetchEntries();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">📅 Period History</h1>
      <PeriodHistory entries={entries} />
    </main>
  );
}