"use client";
import React, { useCallback } from "react";
import { useAttendanceData } from "../../context/AttendanceDataContext";
import dynamic from "next/dynamic";

const QRCodeScanner = dynamic(
  () => import("../../components/attendance/QRCodeScanner"),
  {
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading Scanner...</p>
      </div>
    ),
    ssr: false,
  }
);

import AttendanceStats from "./AttendanceStats";
import AttendanceHistory from "./AttendanceHistory";
import AttendanceIntegration from "./AttendanceIntegration";

export default function AttendanceDashboard() {
  // ✅ Fixed: Use the correct property names from your context
  const { data, stats, isLoading, isError, error } = useAttendanceData();

  const handleSuccess = useCallback(() => {
    console.log("Check-in successful!");
  }, []);

  const handleError = useCallback((error: string) => {
    console.error("Check-in error:", error);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading Attendance System
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="h-10 w-10 text-red-600"
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
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            System Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {/* ✅ Fixed: Properly handle error display */}
            {error?.message || "An unexpected error occurred"}
          </p>
          <div className="space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg animate-pulse">
                <svg
                  className="h-8 w-8 text-white"
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-indigo-200">
                Sistem Absensi
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              QR Code Scanner dengan Location-Based Verification
            </p>

            {/* Quick Stats Summary */}
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.attendanceRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Kehadiran
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.currentStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalDays}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Hari
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {/* ✅ Fixed: Pass the stats directly from context and use isLoading */}
        <AttendanceStats stats={stats} loading={isLoading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner */}
          <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 8h4.01M16 8h4.01"
                    />
                  </svg>
                </div>
                QR Code Scanner
              </h2>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Ready
              </div>
            </div>

            <QRCodeScanner onSuccess={handleSuccess} onError={handleError} />

            {/* Scanner Instructions */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Cara Menggunakan
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Arahkan kamera ke QR Code absensi</li>
                <li>• Pastikan lokasi Anda sudah aktif</li>
                <li>• Tunggu konfirmasi check-in berhasil</li>
              </ul>
            </div>
          </div>

          {/* Today's Schedule & Recent History */}
          <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                Riwayat Terbaru
              </h2>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {data.length > 0 && (
                  <span>
                    Update terakhir:{" "}
                    {new Date(stats.lastUpdated).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>

            <AttendanceHistory limit={5} title="" />

            {/* Quick Actions */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Lihat Semua
              </button>
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Ekspor Data
              </button>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
          <AttendanceIntegration />
        </div>

        {/* Data Summary */}
        {data.length > 0 && (
          <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              Ringkasan Data
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.presentDays}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Hadir
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.absentDays}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                  Tidak Hadir
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.lateCount}
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                  Terlambat
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.permissionCount}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Izin
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.sickCount}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  Sakit
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.earlyLeaveCount}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  Pulang Awal
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.longestStreak}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  Streak Max
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
