"use client";

export default function PeriodStats({ prediction }) {
  if (!prediction) return null;

  return (
    <div className="border p-4 rounded bg-green-50">
      <h2 className="font-bold mb-2">Cycle Insights</h2>
      <p>📅 Next Start: {new Date(prediction.nextStartDate).toLocaleDateString()}</p>
      <p>🔁 Avg Cycle Length: {prediction.avgCycleLength} days</p>
      <p>⏳ Avg Period Duration: {prediction.avgDuration} days</p>
    </div>
  );
}