// components/AttendanceControl.tsx
"use client";

import React, { useState } from "react";
import { useAttendanceActions } from "../../context/AttendanceContext";
import { useAttendanceData } from "../../context/AttendanceDataContext";
import AttendanceReport from "./AttendanceReport";

export default function AttendanceControl() {
  const {
    isTracking,
    startAttendanceTracking,
    stopAttendanceTracking,
    exportAttendance,
  } = useAttendanceActions();

  // ✅ Get data from context for display purposes only
  const { data, stats, isLoading } = useAttendanceData();

  const [showReport, setShowReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // ✅ Call exportAttendance with date range
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // Last month
      const endDate = new Date();

      const csvData = await exportAttendance(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );

      // ✅ Handle blob creation properly
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export attendance data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/60 via-white/40 to-blue-50/60 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Attendance Control
              </h2>
              <p className="text-slate-600 font-medium">
                Track and manage student attendance in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isTracking ? (
            <button
              onClick={startAttendanceTracking}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-green-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                <span>Start Tracking</span>
              </div>
            </button>
          ) : (
            <button
              onClick={stopAttendanceTracking}
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 hover:from-red-700 hover:via-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-red-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10h6v4H9z"
                  />
                </svg>
                <span>Stop Tracking</span>
              </div>
            </button>
          )}

          <button
            onClick={() => setShowReport(!showReport)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5"
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
              <span className="hidden sm:inline">
                {showReport ? "Hide Report" : "Show Report"}
              </span>
              <span className="sm:hidden">{showReport ? "Hide" : "Show"}</span>
            </div>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-purple-500/25 disabled:transform-none disabled:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-2">
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Exporting...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
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
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Status Section */}
      <div className="mb-8 bg-gradient-to-r from-white/50 to-blue-50/50 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Status Indicator */}
          <div className="flex items-center gap-4">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-sm transition-all duration-300 ${
                isTracking
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-200 shadow-lg"
                  : "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-200 shadow-md"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  isTracking
                    ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                    : "bg-gray-400"
                }`}
              ></div>
              {isTracking ? "Tracking Active" : "Tracking Inactive"}
            </div>

            {isTracking && (
              <div className="text-sm text-slate-600 font-medium">
                Session started:{" "}
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            )}
          </div>

          {/* ✅ Live Stats Display */}
          {!isLoading && data.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.presentDays}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Present
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {stats.absentDays}
                </div>
                <div className="text-xs text-slate-600 font-medium">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {stats.lateCount}
                </div>
                <div className="text-xs text-slate-600 font-medium">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.attendanceRate}%
                </div>
                <div className="text-xs text-slate-600 font-medium">Rate</div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">
                Loading attendance data...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Report Section */}
      {showReport && (
        <div className="border-t border-white/20 pt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              Attendance Report
            </h3>
            <p className="text-slate-600">
              Comprehensive attendance analytics and insights
            </p>
          </div>

          {/* ✅ Fixed: Don't pass props to AttendanceReport since it uses context */}
          <AttendanceReport />
        </div>
      )}
    </div>
  );
}
