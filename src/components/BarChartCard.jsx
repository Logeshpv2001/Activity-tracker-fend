// components/BarChartCard.jsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3, Calendar } from "lucide-react";
import dayjs from "dayjs";

export default function BarChartCard({ data, month }) {
  const maxValue = Math.max(...data.map((d) => d.count));
  const avgValue = data.reduce((sum, d) => sum + d.count, 0) / data.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const date = dayjs(`${month}-${payload[0].payload.day}`).format(
        "MMM DD, YYYY",
      );
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{date}</p>
          <p className="text-green-400 text-lg font-bold">
            {payload[0].value} completed
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return (
      <g>
        <defs>
          <linearGradient
            id={`gradient-${props.index}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#059669" stopOpacity={1} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#gradient-${props.index})`}
          rx={4}
        />
      </g>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Daily Completion
          </h3>
          <p className="text-purple-200 text-sm">Track your daily progress</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">Peak Day</p>
          <p className="text-white text-lg font-bold">{maxValue}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">Average</p>
          <p className="text-white text-lg font-bold">{avgValue.toFixed(1)}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-purple-200 text-xs mb-1">Total Days</p>
          <p className="text-white text-lg font-bold">{data.length}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="day"
              stroke="#a78bfa"
              tick={{ fill: "#c4b5fd", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <YAxis
              stroke="#a78bfa"
              tick={{ fill: "#c4b5fd", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar
              dataKey="count"
              shape={<CustomBar />}
              animationDuration={1000}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded"></div>
          <span className="text-purple-200 text-sm">Completed Tasks</span>
        </div>
      </div>
    </div>
  );
}
