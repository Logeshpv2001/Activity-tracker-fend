// pages/Login.jsx

import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  Target,
  Zap,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const floatingIcons = [
    { Icon: Activity, delay: 0, duration: 20 },
    { Icon: TrendingUp, delay: 2, duration: 18 },
    { Icon: Target, delay: 4, duration: 22 },
    { Icon: Zap, delay: 1, duration: 19 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, delay, duration }, index) => (
        <div
          key={index}
          className="absolute text-white opacity-5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        >
          <Icon size={48} />
        </div>
      ))}

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block text-white space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 shadow-2xl">
                  <Activity className="w-8 h-8 transform -rotate-12" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  ProgressTrack
                </h1>
              </div>
              <p className="text-xl text-purple-200">
                Track. Analyze. Achieve.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  Icon: TrendingUp,
                  title: "Track Your Progress",
                  desc: "Monitor daily activities and growth in real-time",
                },
                {
                  Icon: Target,
                  title: "Hit Your Goals",
                  desc: "Set targets and watch yourself reach new milestones",
                },
                {
                  Icon: Zap,
                  title: "Boost Productivity",
                  desc: "Optimize your workflow with intelligent insights",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.Icon className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-purple-200 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
              {/* Mobile branding */}
              <div className="lg:hidden mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
                  <Activity className="w-9 h-9 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  ProgressTrack
                </h1>
                <p className="text-purple-200">Track. Analyze. Achieve.</p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-purple-200">
                  Sign in to continue your journey
                </p>
              </div>

              <form onSubmit={submit} className="space-y-5">
                {/* Email input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-100">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="you@example.com"
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-100">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="••••••••"
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                    {error}
                  </div>
                )}

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-400 focus:ring-offset-0"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Sign up link */}
                <p className="text-center text-purple-200 text-sm">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-white font-semibold hover:underline"
                  >
                    Create one now
                  </a>
                </p>
              </form>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-purple-300 text-xs">
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>Secure Login</span>
              </div>
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Fast & Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
