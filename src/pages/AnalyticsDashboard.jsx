// pages/AnalyticsDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";

import DashboardStats from "../components/DashboardStats";
import PieChartCard from "../components/PieChartCard";
import BarChartCard from "../components/BarChartCard";
import ActivityProgress from "../components/ActivityProgress";

export default function AnalyticsDashboard() {
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState([]);

  const month = dayjs().format("YYYY-MM");
  const daysInMonth = dayjs().daysInMonth();

  useEffect(() => {
    axios.get("/activity").then((res) => setActivities(res.data));
    axios.get(`/activity/month/${month}`).then((res) => setLogs(res.data));
  }, []);

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
    };
  });

  const stats = [
    { label: "Total Activities", value: activities.length },
    { label: "Days This Month", value: daysInMonth },
    { label: "Completed", value: completed },
    {
      label: "Completion %",
      value: `${Math.round((completed / (activities.length * daysInMonth)) * 100 || 0)}%`,
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <DashboardStats stats={stats} />

      <div className="flex gap-4">
        <PieChartCard completed={completed} missed={missed} />
        <BarChartCard data={barData} />
      </div>

      <ActivityProgress data={activityProgress} />
    </div>
  );
}
