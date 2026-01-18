// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ActivityList from "../components/ActivityList";
import TrackerGrid from "../components/TrackerGrid";
import dayjs from "dayjs";
import {
  Activity,
  TrendingUp,
  Target,
  Calendar,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Flame,
  Award,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    completedToday: 0,
    currentStreak: 0,
    monthlyProgress: 0,
  });
  const month = dayjs().format("YYYY-MM");
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`/activity/month/${month}`);
      setActivityLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get("/activity");
      setActivities(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const calculateStats = (activitiesData) => {
    const today = dayjs().format("YYYY-MM-DD");
    const completedToday = activitiesData.filter((a) =>
      a.completedDates?.includes(today),
    ).length;

    setStats({
      totalActivities: activitiesData.length,
      completedToday: completedToday,
      currentStreak: 5, // Calculate from your data
      monthlyProgress: Math.round(
        (completedToday / (activitiesData.length || 1)) * 100,
      ),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchActivities();
    fetchLogs();
  }, []);

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

      {/* Top Navigation Bar */}
      <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">
                    Lv's ProgressTrack
                  </h1>
                  <p className="text-xs text-purple-200">
                    {dayjs().format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="
      flex items-center gap-2 px-4 py-2
      bg-white/10 hover:bg-white/20
      border border-white/20
      rounded-xl text-red-300
      transition-all
    "
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-73px)]">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Activity List */}
        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-30 lg:z-0
            w-80 xl:w-96 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${!isSidebarOpen && "lg:w-0 lg:overflow-hidden"}
          `}
        >
          <div className="h-full bg-white/5 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
            <ActivityList reload={fetchActivities} activities={activities} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 space-y-6">
            {/* Calendar/Tracker Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Activity Tracker
                      </h2>
                      <p className="text-sm text-purple-200">
                        {dayjs().format("MMMM YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm transition-colors">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg rounded-xl text-white text-sm transition-all">
                      Today
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <TrackerGrid
                  activities={activities}
                  activityLogs={activityLogs}
                  month={month}
                  refreshLogs={fetchLogs}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
