"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
  UserPlus,
  Search,
  Filter,
  Download,
  Target,
} from "lucide-react";
import { Student } from "../../../lib/types/student";
import StudentList from "../../../app/components/teacher/StudentList";

// Helper function untuk status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
    case "Aktif":
      return {
        bg: "bg-gradient-to-r from-blue-100 to-cyan-100",
        text: "text-blue-800",
        border: "border-blue-200/50",
      };
    case "Berprestasi":
      return {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        text: "text-green-800",
        border: "border-green-200/50",
      };
    case "Perlu Perhatian":
      return {
        bg: "bg-gradient-to-r from-orange-100 to-yellow-100",
        text: "text-orange-800",
        border: "border-orange-200/50",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-100 to-slate-100",
        text: "text-gray-800",
        border: "border-gray-200/50",
      };
  }
};

export default function ManajemenSiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/teacher/students");
        if (!response.ok) {
          throw new Error("Gagal mengambil data siswa");
        }
        const data = await response.json();
        setStudents(data.students);
        setStats({
          total: data.total,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const renderLoading = () => (
    <div className="flex justify-center items-center py-24">
      <div className="flex items-center gap-4 text-xl font-semibold text-slate-600">
        <Loader2 className="animate-spin h-8 w-8 text-cyan-600" />
        <span>Memuat data siswa...</span>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-24">
      <div className="backdrop-blur-xl bg-white/30 border border-red-200/50 rounded-3xl p-16 shadow-2xl max-w-lg mx-auto">
        <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="h-16 w-16 text-red-600" />
        </div>
        <h3 className="text-3xl font-bold text-red-800 mb-4">
          Terjadi Kesalahan
        </h3>
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center py-24">
      <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-16 shadow-2xl max-w-lg mx-auto">
        <div className="w-32 h-32 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <Users className="h-16 w-16 text-cyan-600" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-4">
          Belum ada siswa
        </h3>
        <p className="text-slate-600 text-xl mb-8">
          Mulai dengan menambahkan siswa pertama
        </p>
        <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
          Tambah Siswa Sekarang
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Background dengan gradient modern konsisten */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Modern Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-lg animate-pulse">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-cyan-800 to-blue-800 bg-clip-text text-transparent">
                  Manajemen Siswa
                </h1>
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Lihat dan kelola data siswa yang Anda ajar
              </p>

              {/* Stats Overview */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <Users className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {stats.total} Siswa
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Student Manager
                  </span>
                </div>
              </div>
            </div>

            <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-cyan-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <UserPlus className="h-6 w-6 transition-transform group-hover:rotate-180 duration-500" />
                <span className="text-lg">Tambah Siswa</span>
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cari siswa..."
                    className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Students Grid */}
          <div className="space-y-6">
            {loading ? (
              renderLoading()
            ) : error ? (
              renderError()
            ) : students.length === 0 ? (
              renderEmpty()
            ) : (
              <StudentList students={students} />
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="mt-12">
            <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-600" />
                Aksi Cepat
              </h3>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <UserPlus className="h-4 w-4" />
                  <span>Tambah Siswa</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                  <Activity className="h-4 w-4" />
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
