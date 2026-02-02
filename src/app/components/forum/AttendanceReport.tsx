// components/AttendanceReport.tsx
"use client";

import React from "react";
import { useAttendanceData } from "../../context/AttendanceDataContext";
import { AttendanceRecord, AttendanceStats } from "../../types/attendance";

export default function AttendanceReport() {
  // ✅ Fixed: Use available context data instead of non-existent getAttendanceReport
  const {
    data: attendanceData,
    stats,
    isLoading,
    isError,
  } = useAttendanceData();

  // ✅ Handle duration dengan fallback calculation
  const getDuration = (record: AttendanceRecord): number => {
    // Gunakan stored duration jika ada
    if (record.duration !== undefined) {
      return record.duration * 60 * 1000; // Convert minutes to milliseconds
    }

    // Calculate dari checkInTime dan checkOutTime
    if (record.checkInTime && record.checkOutTime) {
      const checkIn = new Date(`2000-01-01T${record.checkInTime}`).getTime();
      const checkOut = new Date(`2000-01-01T${record.checkOutTime}`).getTime();
      return checkOut - checkIn; // milliseconds
    }

    // Default duration untuk incomplete records
    return 0;
  };

  const formatDuration = (durationMs: number): string => {
    if (durationMs === 0) return "No duration";

    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "permission":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sick":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "early_leave":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "excused":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSessionTypeIcon = (sessionData?: any) => {
    if (!sessionData) return "🏫";

    switch (sessionData.sessionType) {
      case "video_call":
        return "📹";
      case "in_person":
        return "👥";
      case "hybrid":
        return "🔄";
      default:
        return "🏫";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Loading attendance report...
          </p>
        </div>
      </div>
    );
  }

  if (isError || attendanceData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/60 to-slate-50/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Attendance Data
        </h3>
        <p className="text-gray-600 mb-2">
          No attendance records available to display
        </p>
        <p className="text-gray-500 text-sm">
          Start tracking attendance to see detailed reports here
        </p>
      </div>
    );
  }

  // ✅ Statistics calculation dengan proper handling menggunakan data dari context
  const activeCount = attendanceData.filter(
    (r) => r.status === "present"
  ).length; // Simplified active logic
  const presentCount = attendanceData.filter(
    (r) => r.status === "present"
  ).length;
  const lateCount = attendanceData.filter((r) => r.status === "late").length;
  const absentCount = attendanceData.filter((r) =>
    ["absent", "permission", "sick"].includes(r.status)
  ).length;

  const avgDuration = (() => {
    const recordsWithDuration = attendanceData.filter(
      (r) => getDuration(r) > 0
    );
    if (recordsWithDuration.length === 0) return 0;

    const totalDuration = recordsWithDuration.reduce(
      (acc, record) => acc + getDuration(record),
      0
    );

    return Math.round(totalDuration / (1000 * 60) / recordsWithDuration.length);
  })();

  return (
    <div className="bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            Attendance Report
          </h3>
          <p className="text-gray-600">
            Comprehensive attendance data and analytics
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Records</div>
          <div className="text-2xl font-bold text-blue-600">
            {attendanceData.length}
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {attendanceData.length}
          </div>
          <div className="text-xs text-blue-600 font-medium">
            Total Students
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-4 h-4 text-green-600"
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
          </div>
          <div className="text-2xl font-bold text-green-700">
            {presentCount}
          </div>
          <div className="text-xs text-green-600 font-medium">Present</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700">{absentCount}</div>
          <div className="text-xs text-red-600 font-medium">Absent</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-4 h-4 text-yellow-600"
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
          <div className="text-2xl font-bold text-yellow-700">{lateCount}</div>
          <div className="text-xs text-yellow-600 font-medium">Late</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-4 h-4 text-purple-600"
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
          <div className="text-2xl font-bold text-purple-700">
            {stats.attendanceRate}%
          </div>
          <div className="text-xs text-purple-600 font-medium">Rate</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceData.slice(0, 10).map((record, index) => (
                <tr
                  key={record.id || index}
                  className="hover:bg-blue-50/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {(record.userId || record.studentName || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {record.studentName || record.userId || "Student"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {record.userId || record.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(
                      record.date || record.createdAt
                    ).toLocaleDateString("id-ID", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.checkInTime ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        {typeof record.checkInTime === "string"
                          ? record.checkInTime.includes("T")
                            ? new Date(record.checkInTime).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : record.checkInTime
                          : new Date(record.checkInTime).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.checkOutTime ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        {typeof record.checkOutTime === "string"
                          ? record.checkOutTime.includes("T")
                            ? new Date(record.checkOutTime).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : record.checkOutTime
                          : new Date(record.checkOutTime).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
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
                      {formatDuration(getDuration(record))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {record.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More Records Button */}
        {attendanceData.length > 10 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                Show {attendanceData.length - 10} more records
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session type breakdown - Simplified since we don't have detailed session data */}
      <div className="mt-6 p-6 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-white/50">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg
              className="w-4 h-4 text-blue-600"
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
          Summary Statistics
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white/60 rounded-lg border border-white/40">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="p-4 bg-white/60 rounded-lg border border-white/40">
            <div className="text-2xl font-bold text-purple-600">
              {stats.longestStreak}
            </div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
          <div className="p-4 bg-white/60 rounded-lg border border-white/40">
            <div className="text-2xl font-bold text-blue-600">
              {stats.punctualityRate}%
            </div>
            <div className="text-sm text-gray-600">Punctuality</div>
          </div>
          <div className="p-4 bg-white/60 rounded-lg border border-white/40">
            <div className="text-2xl font-bold text-orange-600">
              {avgDuration || 0}
            </div>
            <div className="text-sm text-gray-600">Avg Duration (min)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
