"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Quiz } from "../../../app/api/teacher/quizzes/store";
import {
  FiPlus,
  FiEye,
  FiUsers,
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiFileText,
  FiAward,
  FiActivity,
} from "react-icons/fi";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/teacher/quizzes");
        if (!response.ok) {
          throw new Error("Gagal mengambil data kuis.");
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kuis ini?")) return;

    try {
      const response = await fetch(`/api/teacher/quizzes/${quizId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Gagal menghapus kuis.");
      }
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Background dengan gradient modern konsisten */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Modern Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg animate-pulse">
                  <FiBookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                  Manajemen Kuis
                </h1>
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Kelola dan monitor kuis pembelajaran dengan mudah
              </p>
              {/* Stats Overview */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiFileText className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {quizzes.length} Kuis
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiActivity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {quizzes.reduce(
                      (total, quiz) => total + (quiz.questions?.length || 0),
                      0
                    )}{" "}
                    Soal
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/teacher/quizzes/new"
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-emerald-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <FiPlus className="h-6 w-6 transition-transform group-hover:rotate-180 duration-500" />
                <span className="text-lg">Buat Kuis Baru</span>
              </div>
            </Link>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="backdrop-blur-xl bg-red-50/90 border border-red-200/50 rounded-2xl p-4 shadow-lg">
                <p className="text-red-600 font-medium text-center flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-emerald-400"></div>
                </div>
                <p className="text-slate-600 mt-6 text-lg font-medium animate-pulse">
                  Memuat kuis...
                </p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-24">
                <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-16 shadow-2xl max-w-lg mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <FiAward className="h-16 w-16 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    Belum ada kuis
                  </h3>
                  <p className="text-slate-600 text-xl mb-8">
                    Mulai dengan membuat kuis pembelajaran pertama
                  </p>
                  <Link
                    href="/teacher/quizzes/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FiPlus className="h-5 w-5" />
                    Buat Kuis Sekarang
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {quizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="group relative backdrop-blur-xl bg-white/40 hover:bg-white/70 border border-white/30 rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:-translate-y-4 shadow-xl hover:shadow-2xl"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: "slideInUp 0.8s ease-out forwards",
                    }}
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl font-semibold text-sm backdrop-blur-sm bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 border border-emerald-200/50 group-hover:from-emerald-500/40 group-hover:to-teal-500/40 transition-all duration-500">
                          <FiBookOpen className="h-4 w-4" />
                          <span>{quiz.subject || "Umum"}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100/70 px-3 py-2 rounded-full backdrop-blur-sm">
                          {new Date(quiz.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-800 transition-colors duration-300">
                        {quiz.title}
                      </h3>

                      {/* Quiz Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100/50">
                          <FiFileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-blue-600 font-medium">
                              Soal
                            </p>
                            <p className="text-sm font-bold text-blue-800">
                              {quiz.questions?.length || 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100/50">
                          <FiUsers className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-purple-600 font-medium">
                              Peserta
                            </p>
                            <p className="text-sm font-bold text-purple-800">
                              {quiz.participants || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Duration */}
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <FiClock className="h-4 w-4" />
                        <span>Durasi: {quiz.duration || 60} menit</span>
                      </div>

                      {/* Quiz Status */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            quiz.isActive
                              ? "bg-green-100 text-green-700 border border-green-200/50"
                              : "bg-gray-100 text-gray-600 border border-gray-200/50"
                          }`}
                        >
                          {quiz.isActive ? "Aktif" : "Tidak Aktif"}
                        </div>
                        {quiz.averageScore && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold border border-yellow-200/50">
                            <FiTrendingUp className="h-3 w-3" />
                            Rata-rata: {quiz.averageScore}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-5 bg-gradient-to-r from-slate-50/60 to-white/60 border-t border-white/40 flex justify-between items-center backdrop-blur-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/teacher/quizzes/${quiz.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600"
                        >
                          <FiEye className="h-4 w-4" />
                          <span>Lihat Hasil</span>
                        </Link>
                        <Link
                          href={`/teacher/quizzes/${quiz.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        >
                          <FiEdit3 className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </div>

                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="group/delete p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/70 transition-all duration-300 transform hover:scale-125 hover:rotate-12"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Glassmorphism overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS untuk animations */}
      <style jsx>{`
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
