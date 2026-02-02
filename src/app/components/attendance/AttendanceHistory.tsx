// components/attendance/AttendanceHistory.tsx
"use client";
import React, { useState, useMemo } from "react";
import { useAttendanceData } from "../../context/AttendanceDataContext";
import { AttendanceRecord } from "../../types/attendance";

interface AttendanceHistoryProps {
  limit?: number;
  title?: string;
  showFilters?: boolean;
  showExport?: boolean;
}

export default function AttendanceHistory({
  limit,
  title = "Riwayat Absensi",
  showFilters = true,
  showExport = true,
}: AttendanceHistoryProps) {
  // ✅ Tambahkan default empty array untuk menghindari error "not iterable"
  const { data = [], isLoading } = useAttendanceData();

  const [filters, setFilters] = useState({
    subject: "",
    status: "",
    dateRange: "all" as "all" | "thisWeek" | "thisMonth",
    sortBy: "date" as "date" | "subject" | "status",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 10;

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    // ✅ Guard clause untuk memastikan records adalah array
    if (!data || !Array.isArray(data)) {
      return [];
    }

    let filtered = [...data];

    // Filter by subject
    if (filters.subject) {
      filtered = filtered.filter(
        (record) => record.subject === filters.subject
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((record) => record.status === filters.status);
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange === "thisWeek") {
      const weekStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      filtered = filtered.filter(
        (record) => new Date(record.date) >= weekStart
      );
    } else if (filters.dateRange === "thisMonth") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(
        (record) => new Date(record.date) >= monthStart
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "subject":
          return a.subject.localeCompare(b.subject);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [data, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique subjects for filter
  const uniqueSubjects = useMemo(() => {
    // ✅ Guard clause untuk uniqueSubjects juga
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return [...new Set(data.map((record) => record.subject))];
  }, [data]);

  const getStatusBadge = (status: string) => {
    const badges = {
      present:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      absent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      permission:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      sick: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    };
    return (
      badges[status as keyof typeof badges] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      present: "✅",
      late: "⏰",
      absent: "❌",
      permission: "📝",
      sick: "🤒",
    };
    return icons[status as keyof typeof icons] || "❓";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    const date = new Date(timeString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Tanggal", "Mata Pelajaran", "Guru", "Status", "Waktu Masuk", "Catatan"],
      ...filteredRecords.map((record) => [
        record.date,
        record.subject,
        record.teacher,
        record.status,
        formatTime(record.checkInTime),
        record.notes || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {showExport && filteredRecords.length > 0 && (
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pelajaran
            </label>
            <select
              value={filters.subject}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Semua</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Semua</option>
              <option value="present">Hadir</option>
              <option value="late">Terlambat</option>
              <option value="absent">Tidak Hadir</option>
              <option value="permission">Izin</option>
              <option value="sick">Sakit</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Periode
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: e.target.value as any,
                }))
              }
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Semua</option>
              <option value="thisWeek">Minggu Ini</option>
              <option value="thisMonth">Bulan Ini</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Urutkan
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="date">Tanggal Terbaru</option>
              <option value="subject">Mata Pelajaran</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {paginatedRecords.length} dari {filteredRecords.length}{" "}
        catatan absensi
      </div>

      {/* Records List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Belum Ada Data Absensi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Mulai absen untuk melihat riwayat di sini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                      {record.subject}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusBadge(
                        record.status
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIcon(record.status)}
                      </span>
                      {record.status === "present"
                        ? "Hadir"
                        : record.status === "late"
                        ? "Terlambat"
                        : record.status === "absent"
                        ? "Tidak Hadir"
                        : record.status === "permission"
                        ? "Izin"
                        : record.status === "sick"
                        ? "Sakit"
                        : record.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    👨‍🏫 {record.teacher}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-4">📅 {formatDate(record.date)}</span>
                    <span>⏰ {formatTime(record.checkInTime)}</span>
                  </div>
                </div>
              </div>

              {record.notes && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💬 {record.notes}
                  </p>
                </div>
              )}

              {record.location && (
                <div className="mt-2 text-xs text-gray-400">
                  📍 Lat: {record.location.latitude.toFixed(4)}, Long:{" "}
                  {record.location.longitude.toFixed(4)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
