"use client";

import { useState, useEffect } from "react";
import JadwalDay from "../components/ui/JadwalDay";
import JadwalStats from "../components/ui/JadwalStats";
import { getCurrentWeekJadwal, JADWAL_DATA, DAYS_OF_WEEK } from "../constants/jadwal";

export default function JadwalPage() {
  const [jadwalWeek, setJadwalWeek] = useState(getCurrentWeekJadwal());
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [currentWeek, setCurrentWeek] = useState(1);

  const allSchedules = JADWAL_DATA;
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

  const getTodaySchedules = () => {
    const todayDay = new Date().getDay();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayDayName = dayNames[todayDay];
    return allSchedules.filter(schedule => schedule.day === todayDayName);
  };

  const getSelectedDaySchedules = () => {
    if (selectedDay === "all") return allSchedules;
    return allSchedules.filter(schedule => schedule.day === selectedDay);
  };

  const getCurrentDayName = () => {
    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return dayNames[today.getDay()];
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5"></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-300 mb-4">
            Jadwal Pelajaran
          </h1>
          <p className="text-blue-200/80 text-lg max-w-2xl mx-auto mb-6">
            Kelola dan pantau jadwal pembelajaran Anda dengan mudah
          </p>
          
          {/* Current Time & Day */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {getCurrentTime()}
                </div>
                <div className="text-blue-200/70 text-sm">Waktu Sekarang</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">
                  {getCurrentDayName()}
                </div>
                <div className="text-blue-200/70 text-sm">Hari Ini</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <JadwalStats schedules={allSchedules} />

        {/* View Controls */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  viewMode === "week"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-blue-200/80 hover:text-white"
                }`}
              >
                Tampilan Mingguan
              </button>
              <button
                onClick={() => setViewMode("day")}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  viewMode === "day"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-blue-200/80 hover:text-white"
                }`}
              >
                Tampilan Harian
              </button>
            </div>

            {/* Day Filter (for day view) */}
            {viewMode === "day" && (
              <div className="flex-1">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-800">Semua Hari</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day.key} value={day.key} className="bg-slate-800">
                      {day.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Week Navigation (for week view) */}
            {viewMode === "week" && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-white font-medium">Minggu {currentWeek}</span>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === "week" ? (
          <div className="space-y-6">
            {jadwalWeek.map((day) => (
              <JadwalDay 
                key={day.day} 
                day={day} 
                isToday={day.date === today}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {selectedDay === "all" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedules = allSchedules.filter(s => s.day === day.key);
                  const dayData = {
                    day: day.key,
                    dayName: day.name,
                    date: today, // You might want to calculate actual dates
                    schedules: daySchedules,
                  };
                  return (
                    <JadwalDay 
                      key={day.key} 
                      day={dayData} 
                      isToday={day.key === "monday"} // You might want to calculate this properly
                    />
                  );
                })}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {(() => {
                  const daySchedules = getSelectedDaySchedules();
                  const dayData = {
                    day: selectedDay,
                    dayName: DAYS_OF_WEEK.find(d => d.key === selectedDay)?.name || selectedDay,
                    date: today,
                    schedules: daySchedules,
                  };
                  return (
                    <JadwalDay 
                      day={dayData} 
                      isToday={selectedDay === "monday"} // You might want to calculate this properly
                    />
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4">Aksi Cepat</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
                Download Jadwal
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
                Bagikan Jadwal
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
