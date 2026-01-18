// components/PieChartCard.jsx

import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

export default function PieChartCard({ completed, missed }) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Missed", value: missed },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Completion Ratio</h3>
      <PieChart width={250} height={250}>
        <Pie data={data} dataKey="value" outerRadius={90}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
