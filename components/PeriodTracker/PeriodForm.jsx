"use client";

import { useState } from "react";

export default function PeriodForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flowLevel, setFlowLevel] = useState("normal");
  const [painLevel, setPainLevel] = useState("mild");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/period-tracker/create", {
      method: "POST",
      body: JSON.stringify({ startDate, endDate, flowLevel, painLevel, notes }),
    });
    if (res.ok) {
      alert("✅ Period entry added!");
      setStartDate("");
      setEndDate("");
      setFlowLevel("normal");
      setPainLevel("mild");
      setNotes("");
    } else {
      alert("❌ Failed to add entry.");
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
        <label className="block font-medium">Pain Level:</label>
        <select
          value={painLevel}
          onChange={(e) => setPainLevel(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="none">None</option>
          <option value="mild">Mild</option>
          <option value="severe">Severe</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save Entry
      </button>
    </form>
  );
}