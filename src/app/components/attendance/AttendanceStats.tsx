// components/attendance/AttendanceStats.tsx
import React from "react";
import { AttendanceStats as StatsType } from "../../types/attendance";

interface AttendanceStatsProps {
  stats: StatsType | null;
  loading?: boolean;
}

export default function AttendanceStats({
  stats,
  loading,
}: AttendanceStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-gray-700/50 animate-pulse"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 dark:text-gray-400">
          Statistik absensi tidak tersedia
        </p>
      </div>
    );
  }

  const getAttendanceGrade = (rate: number) => {
    if (rate >= 95)
      return { grade: "A+", color: "text-green-600 dark:text-green-400" };
    if (rate >= 90)
      return { grade: "A", color: "text-green-600 dark:text-green-400" };
    if (rate >= 85)
      return { grade: "B+", color: "text-blue-600 dark:text-blue-400" };
    if (rate >= 80)
      return { grade: "B", color: "text-blue-600 dark:text-blue-400" };
    if (rate >= 75)
      return { grade: "C+", color: "text-yellow-600 dark:text-yellow-400" };
    if (rate >= 70)
      return { grade: "C", color: "text-yellow-600 dark:text-yellow-400" };
    return { grade: "D", color: "text-red-600 dark:text-red-400" };
  };

  const attendanceGrade = getAttendanceGrade(stats.attendanceRate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Attendance Rate */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-bold ${attendanceGrade.color} bg-white/50 dark:bg-gray-800/50`}
          >
            {attendanceGrade.grade}
          </div>
        </div>
        <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
          {stats.attendanceRate.toFixed(1)}%
        </div>
        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
          Tingkat Kehadiran
        </div>
        <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-3">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(stats.attendanceRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Present Days */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
          {stats.presentDays}
        </div>
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          Hari Hadir
        </div>
        <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
          dari {stats.totalDays} hari total
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          {stats.currentStreak >= 7 && <div className="text-xl">🔥</div>}
        </div>
        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
          {stats.currentStreak}
        </div>
        <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
          Streak Hari Ini
        </div>
        <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
          {stats.currentStreak >= 7 ? "Luar biasa!" : "Pertahankan!"}
        </div>
      </div>

      {/* Late Count */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <svg
              className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-1">
          {stats.lateCount}
        </div>
        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
          Kali Terlambat
        </div>
        <div className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
          {stats.lateCount === 0 ? "Perfect!" : "Bisa diperbaiki"}
        </div>
      </div>
    </div>
  );
}
