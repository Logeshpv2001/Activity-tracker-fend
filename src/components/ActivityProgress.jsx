import React from "react";

// components/ActivityProgress.jsx

export default function ActivityProgress({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Activity Progress</h3>
      {data.map((a) => (
        <div key={a.name} className="mb-2">
          <div className="flex justify-between text-sm">
            <span>{a.name}</span>
            <span>{a.percent}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${a.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
