"use client";
import React from "react";
import {
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiUserCheck,
  FiUserX
} from "react-icons/fi";

// Mock Data for Admin Sekolah - will be fetched from API later
const mockTodayAttendance = {
  students: { present: 850, absent: 45, late: 15, total: 910 },
  teachers: { present: 48, absent: 2, late: 0, total: 50 },
};

const mockOngoingClasses = [
  { id: 1, class: "X-IPA-1", subject: "Matematika", teacher: "Budi Santoso", room: "R. 101", time: "08:00 - 09:30" },
  { id: 2, class: "XI-IPS-2", subject: "Sejarah", teacher: "Siti Aminah", room: "R. 203", time: "08:00 - 09:30" },
  { id: 3, class: "XII-IPA-3", subject: "Fisika", teacher: "Agus Ringgo", room: "Lab Fisika", time: "08:00 - 09:30" },
];

const mockActionItems = [
  { id: 1, type: "approval", message: "3 Guru mengajukan cuti", urgency: "medium" },
  { id: 2, type: "alert", message: "Kelas X-IPS-1 belum ada guru (15 menit)", urgency: "high" },
  { id: 3, type: "info", message: "Rapat evaluasi bulanan besok", urgency: "low" },
];

export default function AdminSekolahDashboardPage() {
  // School name will come from session/API in future, using fallback for now
  const schoolName = "Sekolah Anda";

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Dashboard Operasional
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {schoolName} • {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                + Buat Pengumuman
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Row: Daily Attendance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Student Attendance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kehadiran Siswa</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {((mockTodayAttendance.students.present / mockTodayAttendance.students.total) * 100).toFixed(1)}%
                </h3>
                <p className="text-sm text-emerald-600 font-medium mt-1">Hadir Hari Ini</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs text-slate-500">Sakit/Izin</p>
                <p className="font-bold text-slate-800">{mockTodayAttendance.students.absent}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs text-slate-500">Terlambat</p>
                <p className="font-bold text-amber-600">{mockTodayAttendance.students.late}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs text-slate-500">Total</p>
                <p className="font-bold text-slate-800">{mockTodayAttendance.students.total}</p>
              </div>
            </div>
            {/* Decor */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          </div>

          {/* Teacher Attendance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kehadiran Guru</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {mockTodayAttendance.teachers.present} <span className="text-lg text-slate-400 font-normal">/ {mockTodayAttendance.teachers.total}</span>
                </h3>
                <p className="text-sm text-emerald-600 font-medium mt-1">Guru di Sekolah</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                <FiUserCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 relative z-10">
              {mockTodayAttendance.teachers.absent > 0 ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-100">
                  <FiUserX className="w-4 h-4" /> {mockTodayAttendance.teachers.absent} Guru Absen
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                  <FiCheckCircle className="w-4 h-4" /> Semua Hadir
                </div>
              )}
            </div>
            {/* Decor */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50"></div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Schedule & Ongoing */}
          <div className="lg:col-span-2 space-y-6">

            {/* Action Items (Alerts) */}
            {mockActionItems.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FiAlertCircle className="text-amber-500" /> Perlu Perhatian
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {mockActionItems.map(item => (
                    <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.urgency === 'high' ? 'bg-rose-500' :
                          item.urgency === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                        <span className="text-slate-700 font-medium">{item.message}</span>
                      </div>
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                        Tindak Lanjuti &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ongoing Classes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <FiClock className="text-blue-500" /> Sedang Berlangsung
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {mockOngoingClasses.length} Kelas Aktif
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3">Kelas</th>
                      <th className="px-6 py-3">Mata Pelajaran</th>
                      <th className="px-6 py-3">Guru</th>
                      <th className="px-6 py-3">Ruangan</th>
                      <th className="px-6 py-3">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockOngoingClasses.map((cls) => (
                      <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{cls.class}</td>
                        <td className="px-6 py-4 text-slate-700">{cls.subject}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {cls.teacher.charAt(0)}
                          </div>
                          {cls.teacher}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{cls.room}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cls.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-sm text-blue-600 font-medium hover:underline">Lihat Jadwal Lengkap</button>
              </div>
            </div>

          </div>

          {/* Sidebar: Quick Actions */}
          <div className="space-y-6">

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Akses Cepat</h3>
              <div className="grid grid-cols-1 gap-3">
                <a href="/admin-sekolah/teachers" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">Manajemen Guru</span>
                </a>
                <a href="/admin-sekolah/students" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">Manajemen Murid</span>
                </a>
                <a href="/admin-sekolah/schedules" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group">
                  <div className="p-2 bg-violet-100 text-violet-600 rounded-lg group-hover:bg-violet-200 transition-colors">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">Atur Jadwal</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Laporan Mingguan</h3>
                <p className="text-indigo-100 text-sm mb-4">Rekap kehadiran dan akademik minggu ini sudah siap.</p>
                <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold shadow hover:bg-indigo-50 transition-colors">
                  Unduh Laporan
                </button>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
