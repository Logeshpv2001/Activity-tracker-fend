// components/BarChartCard.jsx

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function BarChartCard({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow flex-1">
      <h3 className="font-semibold mb-2">Daily Completion</h3>
      <BarChart width={500} height={250} data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#22c55e" />
      </BarChart>
    </div>
  );
}
