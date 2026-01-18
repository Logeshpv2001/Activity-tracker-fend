// components/ActivityList.jsx

import React, { useState } from "react";
import axios from "../api/axios";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  MoreVertical,
  Activity,
  Sparkles,
} from "lucide-react";

export default function ActivityList({ activities, reload }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const addActivity = async () => {
    if (!name.trim()) return;

    setIsAdding(true);
    try {
      await axios.post("/activity", { name });
      setName("");
      reload();
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`/activity/${id}`);
      reload();
      setActiveMenu(null);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const startEdit = (activity) => {
    setEditingId(activity._id);
    setEditName(activity.name);
    setActiveMenu(null);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      await axios.put(`/activity/${id}`, { name: editName });
      setEditingId(null);
      setEditName("");
      reload();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Activities</h3>
            <p className="text-sm text-purple-200">{activities.length} total</p>
          </div>
        </div>
      </div>

      {/* Add New Activity */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all pr-12"
            placeholder="New activity name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addActivity)}
          />
          <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
        </div>
        <button
          onClick={addActivity}
          disabled={isAdding || !name.trim()}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isAdding ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Add Activity
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mb-4"></div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-purple-300 opacity-50" />
            </div>
            <p className="text-purple-200 text-sm mb-1">No activities yet</p>
            <p className="text-purple-300 text-xs">
              Add your first activity above!
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity._id}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {editingId === activity._id ? (
                // Edit Mode
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) =>
                      handleKeyPress(e, () => saveEdit(activity._id))
                    }
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(activity._id)}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                    <span className="text-white font-medium">
                      {activity.name}
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === activity._id ? null : activity._id,
                        )
                      }
                      className="p-2 hover:bg-white/10 rounded-lg text-purple-300 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === activity._id && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenu(null)}
                        ></div>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden z-20">
                          <button
                            onClick={() => startEdit(activity)}
                            className="w-full px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteActivity(activity._id)}
                            className="w-full px-4 py-2.5 text-left text-red-300 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-200">Active Activities</span>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-white font-semibold">
              {activities.length}
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
