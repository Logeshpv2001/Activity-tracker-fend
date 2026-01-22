// components/PieChartCard.jsx

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, CheckCircle, XCircle } from "lucide-react";

const COLORS = ["#10b981", "#ef4444"];

export default function PieChartCard({ completed, missed }) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Missed", value: missed },
  ];

  const total = completed + missed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{payload[0].name}</p>
          <p className="text-purple-200 text-sm">{payload[0].value} tasks</p>
          <p className="text-purple-300 text-xs mt-1">
            {Math.round((payload[0].value / total) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Completion Ratio
          </h3>
          <p className="text-purple-200 text-sm">
            Overall performance breakdown
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-4xl font-bold text-white">{completionRate}%</p>
          <p className="text-purple-200 text-sm mt-1">Complete</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-200 text-sm font-medium">
              Completed
            </span>
          </div>
          <p className="text-white text-2xl font-bold">{completed}</p>
          <p className="text-green-300 text-xs mt-1">
            {Math.round((completed / total) * 100)}% of total
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 text-sm font-medium">Missed</span>
          </div>
          <p className="text-white text-2xl font-bold">{missed}</p>
          <p className="text-red-300 text-xs mt-1">
            {Math.round((missed / total) * 100)}% of total
          </p>
        </div>
      </div>
    </div>
  );
}
