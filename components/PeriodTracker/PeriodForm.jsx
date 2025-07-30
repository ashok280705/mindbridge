"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PeriodForm({ initialData = null, onSave = null }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [flowLevel, setFlowLevel] = useState(initialData?.flowLevel || "normal");
  const [painLevel, setPainLevel] = useState(initialData?.painLevel || 3);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate) {
      alert("❌ Please enter a start date");
      return;
    }

    const entry = {
      id: initialData?.id || Date.now().toString(),
      startDate,
      endDate: endDate || null,
      flowLevel,
      painLevel: parseInt(painLevel),
      notes,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    const existingEntries = JSON.parse(localStorage.getItem("periodEntries") || "[]");

    if (initialData) {
      const updatedEntries = existingEntries.map((e) =>
        e.id === initialData.id ? entry : e
      );
      localStorage.setItem("periodEntries", JSON.stringify(updatedEntries));
    } else {
      existingEntries.push(entry);
      localStorage.setItem("periodEntries", JSON.stringify(existingEntries));
    }

    alert("✅ Period entry saved successfully!");

    if (onSave) {
      onSave(entry);
    } else {
      setStartDate("");
      setEndDate("");
      setFlowLevel("normal");
      setPainLevel(3);
      setNotes("");

      router.push("/mental-counselor/period-tracker/history");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Flow Level:</label>
        <select
          value={flowLevel}
          onChange={(e) => setFlowLevel(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="light">Light</option>
          <option value="normal">Normal</option>
          <option value="heavy">Heavy</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-2">Pain Level (0-10):</label>
        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => setPainLevel(e.target.value)}
          className="w-full"
        />
        <div className="text-center text-sm text-gray-600 mt-1">
          {painLevel}/10 —{" "}
          {painLevel == 0
            ? "No Pain"
            : painLevel <= 3
            ? "Mild"
            : painLevel <= 6
            ? "Moderate"
            : "Severe"}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any symptoms, mood, or other notes..."
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
      >
        {initialData ? "Update Entry" : "Save Entry"}
      </button>
    </form>
  );
}