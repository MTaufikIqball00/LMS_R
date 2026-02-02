"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiClock,
  FiEdit3,
  FiEye,
  FiTrash2,
  FiFilter,
  FiSearch,
  FiDownload,
  FiActivity,
  FiTarget,
  FiBookOpen,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiX,
  FiLoader,
} from "react-icons/fi";

// Data contoh untuk daftar tugas dengan informasi yang lebih lengkap
interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  status: string;
  submissions: number;
  totalStudents: number;
  subject: string;
  createdAt: string;
  description: string;
  priority: string;
}


// Helper function untuk memberikan warna pada status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Selesai":
      return {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        text: "text-green-800",
        icon: <FiCheckCircle className="h-3 w-3" />,
        border: "border-green-200/50",
      };
    case "Aktif":
      return {
        bg: "bg-gradient-to-r from-blue-100 to-cyan-100",
        text: "text-blue-800",
        icon: <FiActivity className="h-3 w-3" />,
        border: "border-blue-200/50",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-100 to-slate-100",
        text: "text-gray-800",
        icon: <FiAlertCircle className="h-3 w-3" />,
        border: "border-gray-200/50",
      };
  }
};

// Helper function untuk subject colors
const getSubjectColor = (subject: string) => {
  const colors = {
    Biologi: "from-green-500 to-emerald-500",
    Matematika: "from-blue-500 to-indigo-500",
    Kimia: "from-purple-500 to-pink-500",
    "Bahasa Indonesia": "from-orange-500 to-red-500",
  };
  return colors[subject as keyof typeof colors] || "from-gray-500 to-slate-500";
};

// Helper function untuk priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "text-red-600 bg-red-50";
    case "Medium":
      return "text-yellow-600 bg-yellow-50";
    case "Low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function ManajemenTugasPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [subjectFilter, setSubjectFilter] = useState("Semua");
  const [priorityFilter, setPriorityFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("dueDate");

  const handleDelete = async (assignmentId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/teacher/assignments/${assignmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus tugas.");
      }

      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    } catch (err: any) {
      // You might want to show an error notification to the user
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/teacher/assignments");
        if (!response.ok) {
          throw new Error("Gagal mengambil data tugas.");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Gunakan useMemo untuk optimasi agar filter tidak berjalan di setiap render
  const filteredAssignments = useMemo(() => {
    let filtered = assignments
      .filter((assignment) => {
        if (statusFilter === "Semua") return true;
        return assignment.status === statusFilter;
      })
      .filter((assignment) => {
        if (subjectFilter === "Semua") return true;
        return assignment.subject === subjectFilter;
      })
      .filter((assignment) => {
        if (priorityFilter === "Semua") return true;
        return assignment.priority === priorityFilter;
      })
      .filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.className.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Sort assignments
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "submissions":
          return (
            b.submissions / b.totalStudents - a.submissions / a.totalStudents
          );
        default:
          return 0;
      }
    });
  }, [assignments, searchTerm, statusFilter, subjectFilter, priorityFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Semua");
    setSubjectFilter("Semua");
    setPriorityFilter("Semua");
    setSortBy("dueDate");
  };

  return (
    <>
      {/* Background dengan gradient modern konsisten */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/50 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Modern Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg animate-pulse">
                  <FiFileText className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-orange-800 to-red-800 bg-clip-text text-transparent">
                  Manajemen Tugas
                </h1>
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Kelola dan monitor semua tugas dengan sistem filter yang canggih
              </p>

              {/* Enhanced Stats Overview */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiFileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {filteredAssignments.length} dari {assignments.length}{" "}
                    Tugas
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiActivity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {
                      filteredAssignments.filter((a) => a.status === "Aktif")
                        .length
                    }{" "}
                    Aktif
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiTrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Smart Filters
                  </span>
                </div>
              </div>
            </div>

            <Link href="/teacher/assignment/new">
              <button className="group relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-orange-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-3">
                  <FiPlus className="h-6 w-6 transition-transform group-hover:rotate-180 duration-500" />
                  <span className="text-lg">Buat Tugas Baru</span>
                </div>
              </button>
            </Link>
          </div>

          {/* Enhanced Filters and Search */}
          <div className="mb-8">
            <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
              {/* Search Bar */}
              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari tugas berdasarkan judul atau kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                </select>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300"
                >
                  <option value="Semua">Semua Mata Pelajaran</option>
                  <option value="Biologi">Biologi</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300"
                >
                  <option value="Semua">Semua Prioritas</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300"
                >
                  <option value="dueDate">Urutkan: Deadline</option>
                  <option value="createdAt">Urutkan: Terbaru</option>
                  <option value="submissions">Urutkan: Progress</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40"
                  >
                    <FiX className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-24">
                <FiLoader className="h-16 w-16 text-orange-600 animate-spin mx-auto" />
                <p className="text-slate-600 mt-4">Memuat data tugas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24 bg-red-50 p-8 rounded-2xl">
                <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h3 className="text-2xl font-bold text-red-700 mt-4">Terjadi Kesalahan</h3>
                <p className="text-red-600 mt-2">{error}</p>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-24">
                <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-16 shadow-2xl max-w-lg mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <FiSearch className="h-16 w-16 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    Tidak ada hasil
                  </h3>
                  <p className="text-slate-600 text-xl mb-8">
                    Tidak ada tugas yang cocok dengan kriteria pencarian
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredAssignments.map((assignment, index) => {
                  const statusBadge = getStatusBadge(assignment.status);
                  const subjectColor = getSubjectColor(assignment.subject);
                  const completionRate = Math.round(
                    (assignment.submissions / assignment.totalStudents) * 100
                  );
                  const priorityColor = getPriorityColor(assignment.priority);

                  return (
                    <div
                      key={assignment.id}
                      className="group relative backdrop-blur-xl bg-white/50 hover:bg-white/80 border border-white/30 rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 shadow-xl hover:shadow-2xl"
                      style={{
                        animationName: "slideInUp",
                        animationDuration: "0.6s",
                        animationTimingFunction: "ease-out",
                        animationFillMode: "forwards",
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                          {/* Main Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div
                                className={`p-3 bg-gradient-to-r ${subjectColor} rounded-2xl shadow-lg`}
                              >
                                <FiBookOpen className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-800 transition-colors duration-300">
                                    {assignment.title}
                                  </h3>
                                  <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityColor}`}
                                  >
                                    {assignment.priority}
                                  </span>
                                </div>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                  {assignment.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <span className="px-3 py-1 bg-gradient-to-r from-slate-100/80 to-white/80 text-slate-700 text-sm font-semibold rounded-full border border-white/40">
                                    {assignment.className}
                                  </span>
                                  <span
                                    className={`px-3 py-1 ${statusBadge.bg} ${statusBadge.text} text-sm font-semibold rounded-full border ${statusBadge.border} flex items-center gap-1`}
                                  >
                                    {statusBadge.icon}
                                    {assignment.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl border border-blue-200/50">
                                <FiCalendar className="h-5 w-5 text-blue-600 mb-2" />
                                <p className="text-xs text-blue-600 font-medium">
                                  Deadline
                                </p>
                                <p className="text-sm font-bold text-blue-800">
                                  {new Date(
                                    assignment.dueDate
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>

                              <div className="p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-200/50">
                                <FiUsers className="h-5 w-5 text-emerald-600 mb-2" />
                                <p className="text-xs text-emerald-600 font-medium">
                                  Submissions
                                </p>
                                <p className="text-sm font-bold text-emerald-800">
                                  {assignment.submissions}/
                                  {assignment.totalStudents}
                                </p>
                              </div>

                              <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-200/50">
                                <FiTrendingUp className="h-5 w-5 text-purple-600 mb-2" />
                                <p className="text-xs text-purple-600 font-medium">
                                  Completion
                                </p>
                                <p className="text-sm font-bold text-purple-800">
                                  {completionRate}%
                                </p>
                              </div>

                              <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 rounded-xl border border-orange-200/50">
                                <FiClock className="h-5 w-5 text-orange-600 mb-2" />
                                <p className="text-xs text-orange-600 font-medium">
                                  Created
                                </p>
                                <p className="text-sm font-bold text-orange-800">
                                  {new Date(
                                    assignment.createdAt
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                                <span>Progress Pengumpulan</span>
                                <span>{completionRate}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-3">
                                <div
                                  className={`bg-gradient-to-r ${subjectColor} h-3 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                                  style={{ width: `${completionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-3 lg:flex-shrink-0">
                            <Link href={`/teacher/assignment/${assignment.id}`}>
                              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                                <FiEye className="h-4 w-4" />
                                <span>Lihat Detail</span>
                              </button>
                            </Link>
                            <div className="flex gap-2">
                              <Link href={`/teacher/assignment/${assignment.id}/edit`}>
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                                  <FiEdit3 className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                              </Link>
                              <button 
                                onClick={() => handleDelete(assignment.id)}
                                className="p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/70 transition-all duration-300 transform hover:scale-125">
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Glassmorphism overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="mt-12">
            <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiTarget className="h-5 w-5 text-orange-600" />
                Aksi Cepat
              </h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/teacher/assignment/new"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Tugas Baru</span>
                </Link>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                  <FiDownload className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                  <FiActivity className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS untuk animations */}
        <style jsx global>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
