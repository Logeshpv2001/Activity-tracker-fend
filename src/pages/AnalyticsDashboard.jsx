// pages/AnalyticsDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";
import {
  TrendingUp,
  Activity,
  Calendar,
  Award,
  ArrowLeft,
  Download,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardStats from "../components/DashboardStats";
import PieChartCard from "../components/PieChartCard";
import BarChartCard from "../components/BarChartCard";
import ActivityProgress from "../components/ActivityProgress";

export default function AnalyticsDashboard() {
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const month = dayjs().format("YYYY-MM");
  const daysInMonth = dayjs().daysInMonth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [activitiesRes, logsRes] = await Promise.all([
          axios.get("/activity"),
          axios.get(`/activity/month/${month}`),
        ]);
        setActivities(activitiesRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [month]);

  const completed = logs.filter((l) => l.completed).length;
  const missed = activities.length * daysInMonth - completed;

  // Bar chart data
  const barData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = dayjs(`${month}-${day}`).format("YYYY-MM-DD");
    return {
      day,
      count: logs.filter((l) => l.date === date && l.completed).length,
    };
  });

  // Activity progress
  const activityProgress = activities.map((a) => {
    const done = logs.filter(
      (l) => l.activity._id === a._id && l.completed,
    ).length;
    return {
      name: a.name,
      percent: Math.round((done / daysInMonth) * 100),
      completed: done,
      total: daysInMonth,
    };
  });

  const stats = [
    {
      label: "Total Activities",
      value: activities.length,
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      label: "Days This Month",
      value: daysInMonth,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Completed",
      value: completed,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      label: "Completion Rate",
      value: `${Math.round((completed / (activities.length * daysInMonth)) * 100 || 0)}%`,
      icon: Award,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-white"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Analytics Dashboard
                </h1>
                <p className="text-purple-200">
                  {dayjs().format("MMMM YYYY")} - Performance Overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-colors flex items-center gap-2">
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg rounded-xl text-white transition-all flex items-center gap-2">
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-8 space-y-6">
        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChartCard completed={completed} missed={missed} />
          <BarChartCard data={barData} month={month} />
        </div>

        {/* Activity Progress */}
        <ActivityProgress data={activityProgress} />
      </div>
    </div>
  );
}
