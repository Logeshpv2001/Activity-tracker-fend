// components/TrackerGrid.jsx

import dayjs from "dayjs";
import axios from "../api/axios";
import { Check, Flame, Trophy, TrendingUp, Calendar } from "lucide-react";
import React, { useState, useMemo, useEffect, useRef } from "react";

export default function TrackerGrid({
  activities,
  activityLogs,
  month,
  refreshLogs,
}) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [animatingCell, setAnimatingCell] = useState(null);
  const daysInMonth = dayjs(month).daysInMonth();
  const today = dayjs().format("YYYY-MM-DD");
  const scrollContainerRef = useRef(null);
  const todayRef = useRef(null);

  // Get day names
  const getDayName = (dayIndex) => {
    const date = dayjs(`${month}-${dayIndex + 1}`);
    return date.format("ddd");
  };

  // Auto-scroll to today's date on mount
  useEffect(() => {
    if (todayRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const todayElement = todayRef.current;

      // Calculate the scroll position to center today's column
      const containerWidth = container.clientWidth;
      const todayLeft = todayElement.offsetLeft;
      const todayWidth = todayElement.clientWidth;

      // Scroll to center today's date
      const scrollPosition = todayLeft - containerWidth / 2 + todayWidth / 2;

      // Smooth scroll to the position
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  }, [activities, month]); // Re-run when activities or month changes

  const isCompleted = (activityId, date) => {
    return activityLogs.some(
      (log) =>
        log.activity._id === activityId && log.date === date && log.completed,
    );
  };

  const toggle = async (activityId, date) => {
    const cellKey = `${activityId}-${date}`;
    setAnimatingCell(cellKey);

    try {
      await axios.post("/activity/toggle", { activityId, date });
      refreshLogs();

      // Clear animation after a short delay
      setTimeout(() => setAnimatingCell(null), 300);
    } catch (error) {
      console.error("Error toggling activity:", error);
      setAnimatingCell(null);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCells = activities.length * daysInMonth;
    const completedCells = activityLogs.filter((log) => log.completed).length;
    const completionRate =
      totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedLogs = [...activityLogs]
      .filter((log) => log.completed)
      .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

    return {
      totalCells,
      completedCells,
      completionRate,
      currentStreak: 7, // You can calculate this from your data
    };
  }, [activityLogs, activities, daysInMonth]);

  // Check if a date is today
  const isToday = (dayIndex) => {
    const date = dayjs(`${month}-${dayIndex + 1}`).format("YYYY-MM-DD");
    return date === today;
  };

  // Check if date is in the future
  const isFuture = (dayIndex) => {
    const date = dayjs(`${month}-${dayIndex + 1}`);
    return date.isAfter(dayjs(), "day");
  };

  // Check if it's weekend
  const isWeekend = (dayIndex) => {
    const date = dayjs(`${month}-${dayIndex + 1}`);
    const day = date.day();
    return day === 0 || day === 6;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm mb-1">Completion Rate</p>
              <p className="text-white text-2xl font-bold">
                {stats.completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Completed</p>
              <p className="text-white text-2xl font-bold">
                {stats.completedCells}/{stats.totalCells}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm mb-1">Current Streak</p>
              <p className="text-white text-2xl font-bold">
                {stats.currentStreak} days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-lg border border-white/20"></div>
          <span className="text-purple-200">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/5 border border-white/20 rounded-lg"></div>
          <span className="text-purple-200">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/40 rounded-lg"></div>
          <span className="text-purple-200">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-lg opacity-50"></div>
          <span className="text-purple-200">Future</span>
        </div>
      </div>

      {/* Tracker Grid */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto custom-scrollbar"
      >
        <div className="min-w-max">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `240px repeat(${daysInMonth}, 40px)`,
            }}
          >
            {/* Header Row - Activity Name */}
            <div className="sticky left-0 z-20 bg-gradient-to-r from-indigo-950 via-purple-900 to-transparent pr-4">
              <div className="flex items-center gap-2 h-12">
                <Calendar className="w-5 h-5 text-purple-300" />
                <span className="text-white font-semibold">Activity</span>
              </div>
            </div>

            {/* Header Row - Day Numbers */}
            {[...Array(daysInMonth)].map((_, i) => {
              const isCurrentDay = isToday(i);
              const isWeekendDay = isWeekend(i);

              return (
                <div
                  key={i}
                  className="text-center"
                  ref={isCurrentDay ? todayRef : null}
                >
                  <div
                    className={`
                    text-xs font-medium mb-1
                    ${isCurrentDay ? "text-blue-400" : isWeekendDay ? "text-pink-300" : "text-purple-200"}
                  `}
                  >
                    {getDayName(i)}
                  </div>
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold
                    ${
                      isCurrentDay
                        ? "bg-blue-500/20 border-2 border-blue-500 text-blue-300"
                        : "bg-white/5 border border-white/10 text-white"
                    }
                  `}
                  >
                    {i + 1}
                  </div>
                </div>
              );
            })}

            {/* Activity Rows */}
            {activities.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-purple-300 opacity-50" />
                </div>
                <p className="text-purple-200 text-sm mb-1">
                  No activities to track
                </p>
                <p className="text-purple-300 text-xs">
                  Add an activity to start tracking your progress!
                </p>
              </div>
            ) : (
              activities.map((activity, activityIndex) => (
                <React.Fragment key={activity._id}>
                  {/* Activity Name - Sticky */}
                  <div className="sticky left-0 z-10 bg-gradient-to-r from-indigo-950 via-purple-900 to-transparent pr-4">
                    <div className="flex items-center gap-3 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                      <span className="text-white font-medium truncate">
                        {activity.name}
                      </span>
                    </div>
                  </div>

                  {/* Day Cells */}
                  {[...Array(daysInMonth)].map((_, dayIndex) => {
                    const date = dayjs(`${month}-${dayIndex + 1}`).format(
                      "YYYY-MM-DD",
                    );
                    const completed = isCompleted(activity._id, date);
                    const cellKey = `${activity._id}-${date}`;
                    const isHovered = hoveredCell === cellKey;
                    const isAnimating = animatingCell === cellKey;
                    const isCurrentDay = isToday(dayIndex);
                    const isFutureDay = isFuture(dayIndex);

                    return (
                      <div
                        key={dayIndex}
                        onClick={() =>
                          !isFutureDay && toggle(activity._id, date)
                        }
                        onMouseEnter={() => setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`
                          h-12 w-10 rounded-xl flex items-center justify-center
                          border-2 transition-all duration-200 relative
                          ${
                            isFutureDay
                              ? "cursor-not-allowed opacity-30 bg-white/5 border-white/10"
                              : "cursor-pointer"
                          }
                          ${
                            completed && !isFutureDay
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/20"
                              : !isFutureDay
                                ? "bg-white/5 border-white/20 hover:bg-white/10 hover:border-purple-400"
                                : ""
                          }
                          ${
                            isCurrentDay && !completed && !isFutureDay
                              ? "border-blue-500 bg-blue-500/10"
                              : ""
                          }
                          ${isHovered && !isFutureDay ? "scale-110 z-10" : ""}
                          ${isAnimating ? "animate-bounce" : ""}
                        `}
                      >
                        {completed && !isFutureDay && (
                          <Check
                            size={18}
                            className="text-white drop-shadow-lg"
                          />
                        )}

                        {/* Hover Tooltip */}
                        {isHovered && !isFutureDay && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl">
                            {dayjs(date).format("MMM DD, YYYY")}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  );
}
