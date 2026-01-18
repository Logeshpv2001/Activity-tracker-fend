import React from "react";

// components/DashboardStats.jsx

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-2xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
