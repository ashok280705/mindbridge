"use client";

export default function PeriodCalendar({ markedDates = [] }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">📅 Calendar</h2>
      <p>Dates marked: {markedDates.join(", ")}</p>
    </div>
  );
}