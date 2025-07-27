"use client";

export default function DoctorDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">👨‍⚕️ Doctor Dashboard</h1>
      <p className="text-gray-700 mb-8">
        Welcome back, Doctor! Here you can manage your appointments, view patient reports, and update your availability.
      </p>

      {/* ✅ Example sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Today&apos;s Appointments</h2>
          <p className="text-gray-500">5 appointments scheduled</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">New Messages</h2>
          <p className="text-gray-500">2 unread messages</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Patient Requests</h2>
          <p className="text-gray-500">3 pending requests</p>
        </div>
      </div>
    </div>
  );
}