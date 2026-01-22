// components/ActivityProgress.jsx

import React, { useState } from "react";
import {
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
} from "lucide-react";

export default function ActivityProgress({ data }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortBy, setSortBy] = useState("percent"); // 'percent' or 'name'

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "percent") {
      return b.percent - a.percent;
    }
    return a.name.localeCompare(b.name);
  });

  const getProgressColor = (percent) => {
    if (percent >= 80) return "from-green-500 to-emerald-600";
    if (percent >= 60) return "from-blue-500 to-cyan-600";
    if (percent >= 40) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getProgressBgColor = (percent) => {
    if (percent >= 80) return "bg-green-500/10 border-green-500/20";
    if (percent >= 60) return "bg-blue-500/10 border-blue-500/20";
    if (percent >= 40) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const getPerformanceLabel = (percent) => {
    if (percent >= 80)
      return { text: "Excellent", icon: Award, color: "text-green-400" };
    if (percent >= 60)
      return { text: "Good", icon: TrendingUp, color: "text-blue-400" };
    if (percent >= 40)
      return { text: "Fair", icon: Target, color: "text-yellow-400" };
    return { text: "Needs Focus", icon: Flame, color: "text-red-400" };
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Activity Progress
          </h3>
          <p className="text-purple-200 text-sm">
            Individual performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy("percent")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === "percent"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "bg-white/10 text-purple-200 hover:bg-white/20"
            }`}
          >
            By Progress
          </button>
          <button
            onClick={() => setSortBy("name")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === "name"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "bg-white/10 text-purple-200 hover:bg-white/20"
            }`}
          >
            By Name
          </button>
        </div>
      </div>

      {/* Progress List */}
      <div className="space-y-4">
        {sortedData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-300 opacity-50" />
            </div>
            <p className="text-purple-200 text-sm mb-1">
              No activities tracked yet
            </p>
            <p className="text-purple-300 text-xs">
              Start adding activities to see your progress!
            </p>
          </div>
        ) : (
          sortedData.map((activity, index) => {
            const performance = getPerformanceLabel(activity.percent);
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={index}
                className={`border rounded-xl transition-all duration-300 ${getProgressBgColor(activity.percent)}`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  {/* Activity Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <performance.icon
                          className={`w-5 h-5 ${performance.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">
                          {activity.name}
                        </h4>
                        <p className={`text-xs ${performance.color}`}>
                          {performance.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-white text-2xl font-bold">
                          {activity.percent}%
                        </p>
                        <p className="text-purple-200 text-xs">
                          {activity.completed || 0}/{activity.total || 0} days
                        </p>
                      </div>
                      <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-purple-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-purple-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(activity.percent)} rounded-full transition-all duration-1000 relative overflow-hidden`}
                      style={{
                        width: `${activity.percent}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-purple-200 text-xs mb-1">
                          Completed Days
                        </p>
                        <p className="text-white text-xl font-bold">
                          {activity.completed || 0}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-purple-200 text-xs mb-1">
                          Remaining Days
                        </p>
                        <p className="text-white text-xl font-bold">
                          {(activity.total || 0) - (activity.completed || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-200">
                        Keep up the {activity.percent >= 60 ? "great" : "good"}{" "}
                        work!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {sortedData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Total Activities</p>
              <p className="text-white text-2xl font-bold">
                {sortedData.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Avg. Progress</p>
              <p className="text-white text-2xl font-bold">
                {Math.round(
                  sortedData.reduce((sum, a) => sum + a.percent, 0) /
                    sortedData.length,
                )}
                %
              </p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Excellent (≥80%)</p>
              <p className="text-white text-2xl font-bold">
                {sortedData.filter((a) => a.percent >= 80).length}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
