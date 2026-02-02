"use client";

import { useState, useEffect } from "react";
import type { AttendanceRecord } from "../../../app/types/attendance";
import {
  FiClock,
  FiUser,
  FiBookOpen,
  FiCheck,
  FiCalendar,
  FiMapPin,
  FiAlertCircle,
  FiUserCheck,
  FiEye,
  FiUsers,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

export default function AttendanceVerifier() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnverifiedRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/teacher/attendance");
        if (!response.ok) {
          throw new Error("Gagal mengambil data absensi.");
        }
        const data = await response.json();
        setRecords(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnverifiedRecords();
  }, []);

  const handleVerify = async (recordId: string) => {
    setError(null);
    setVerifyingId(recordId);
    try {
      const response = await fetch(
        `/api/teacher/attendance/${recordId}/verify`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memverifikasi absensi.");
      }

      // Remove the verified record from the list with animation
      setRecords((prev) => prev.filter((record) => record.id !== recordId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifyingId(null);
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
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg animate-pulse">
                  <FiUserCheck className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Verifikasi Absensi
                </h1>
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Verifikasi kehadiran siswa yang menunggu konfirmasi
              </p>

              {/* Stats Overview */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiUsers className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {records.length} Menunggu
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiActivity className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Verification Center
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="backdrop-blur-xl bg-red-50/90 border border-red-200/50 rounded-2xl p-4 shadow-lg animate-shake">
                <p className="text-red-600 font-medium text-center flex items-center justify-center gap-2">
                  <FiAlertCircle className="h-5 w-5" />
                  {error}
                </p>
              </div>
            )}

            {/* Main Content Card */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
              {/* Card Header */}
              <div className="p-8 pb-6 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 border-b border-white/20">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <FiClock className="h-7 w-7 text-blue-600" />
                  Menunggu Verifikasi
                </h2>
                <p className="text-slate-600">
                  Daftar absensi siswa yang memerlukan verifikasi manual
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
                    </div>
                    <p className="text-slate-600 mt-6 text-lg font-medium animate-pulse">
                      Memuat data absensi...
                    </p>
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                      <FiCheck className="h-16 w-16 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                      Semua Terverifikasi
                    </h3>
                    <p className="text-slate-600 text-lg">
                      Tidak ada absensi yang perlu diverifikasi saat ini
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {records.map((record, index) => (
                      <div
                        key={record.id}
                        className="group relative backdrop-blur-xl bg-white/50 hover:bg-white/80 border border-white/30 rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "slideInUp 0.6s ease-out forwards",
                        }}
                      >
                        {/* Record Content */}
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                            {/* Student Info */}
                            <div className="flex-1 space-y-4">
                              {/* Student Name */}
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                                  {record.studentName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">
                                    {record.studentName}
                                  </h3>
                                  <p className="text-sm text-slate-600">
                                    Siswa
                                  </p>
                                </div>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Subject */}
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-200/50">
                                  <FiBookOpen className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-emerald-600 font-medium">
                                      Mata Pelajaran
                                    </p>
                                    <p className="text-sm font-bold text-emerald-800">
                                      {record.subject}
                                    </p>
                                  </div>
                                </div>

                                {/* Check-in Time */}
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl border border-blue-200/50">
                                  <FiClock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-blue-600 font-medium">
                                      Waktu Masuk
                                    </p>
                                    <p className="text-sm font-bold text-blue-800">
                                      {new Date(
                                        record.checkInTime
                                      ).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-200/50">
                                  <FiCalendar className="h-5 w-5 text-purple-600 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-purple-600 font-medium">
                                      Tanggal
                                    </p>
                                    <p className="text-sm font-bold text-purple-800">
                                      {new Date(
                                        record.checkInTime
                                      ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Additional Info */}
                              {record.location && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <FiMapPin className="h-4 w-4" />
                                  <div className="flex flex-col">
                                    {record.location.address && (
                                      <span>
                                        Alamat: {record.location.address}
                                      </span>
                                    )}
                                    {record.location.buildingName && (
                                      <span>
                                        Gedung: {record.location.buildingName}
                                      </span>
                                    )}
                                    {record.location.roomNumber && (
                                      <span>
                                        Ruang: {record.location.roomNumber}
                                      </span>
                                    )}
                                    <span className="text-xs opacity-75">
                                      Koordinat:{" "}
                                      {record.location.latitude.toFixed(4)},{" "}
                                      {record.location.longitude.toFixed(4)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 lg:flex-shrink-0">
                              <button
                                onClick={() => handleVerify(record.id)}
                                disabled={verifyingId === record.id}
                                className="group/btn relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-500 transform hover:scale-110 disabled:scale-100 shadow-xl hover:shadow-green-500/25 disabled:cursor-not-allowed min-w-[140px]"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                  {verifyingId === record.id ? (
                                    <>
                                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                      <span>Memverifikasi...</span>
                                    </>
                                  ) : (
                                    <>
                                      <FiCheck className="h-5 w-5 transition-transform group-hover/btn:rotate-12 duration-300" />
                                      <span>Verifikasi</span>
                                    </>
                                  )}
                                </div>
                              </button>

                              <button className="flex items-center justify-center gap-2 px-6 py-3 text-slate-700 bg-white/70 hover:bg-white/90 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                                <FiEye className="h-4 w-4" />
                                <span>Detail</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 px-3 py-1 bg-orange-100/80 text-orange-700 rounded-full text-xs font-semibold border border-orange-200/50 backdrop-blur-sm">
                            <FiClock className="h-3 w-3" />
                            Menunggu
                          </div>
                        </div>

                        {/* Glassmorphism overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            {records.length > 0 && (
              <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FiTarget className="h-5 w-5 text-blue-600" />
                  Aksi Cepat
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      records.forEach((record) => handleVerify(record.id));
                    }}
                    disabled={verifyingId !== null}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
                  >
                    <FiCheck className="h-4 w-4" />
                    <span>Verifikasi Semua</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/70 hover:bg-white/90 text-slate-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40">
                    <FiEye className="h-4 w-4" />
                    <span>Lihat Riwayat</span>
                  </button>
                </div>
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}
