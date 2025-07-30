"use client";

export default function PeriodHistory({ entries }) {
  if (!entries.length) return <p>No entries found.</p>;

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Start Date</th>
          <th className="p-2 border">End Date</th>
          <th className="p-2 border">Flow</th>
          <th className="p-2 border">Pain</th>
          <th className="p-2 border">Notes</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry._id} className="text-center">
            <td className="border p-2">{new Date(entry.startDate).toLocaleDateString()}</td>
            <td className="border p-2">{entry.endDate ? new Date(entry.endDate).toLocaleDateString() : "-"}</td>
            <td className="border p-2">{entry.flowLevel}</td>
            <td className="border p-2">{entry.painLevel}</td>
            <td className="border p-2">{entry.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}