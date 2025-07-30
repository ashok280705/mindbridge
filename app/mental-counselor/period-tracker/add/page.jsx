"use client";

import PeriodForm from "@/components/PeriodTracker/PeriodForm";

export default function AddPeriodPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">➕ Add Period Entry</h1>
      <PeriodForm />
    </main>
  );
}