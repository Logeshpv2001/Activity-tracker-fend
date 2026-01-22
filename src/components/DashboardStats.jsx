// components/DashboardStats.jsx

import React from "react";
import { Zap } from "lucide-react";

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div
              className={`px-2 py-1 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-purple-200 text-sm mb-1">{stat.label}</p>
          <p className="text-white text-3xl font-bold">{stat.value}</p>

          {/* Animated progress line */}
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
              style={{
                width: `${Math.min(100, typeof stat.value === "number" ? stat.value : 75)}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
