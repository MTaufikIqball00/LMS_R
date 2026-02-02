import React from "react";
import { useAttendanceData } from "../../context/AttendanceDataContext";
import { useAttendanceIntegration } from "../../hooks/useAttendanceIntegration";

export default function AttendanceIntegration() {
  const { data, stats } = useAttendanceData();
  const { gradeImpact, courseProgress, parentNotifications, achievements } =
    useAttendanceIntegration(data, stats);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Integrasi Sistem
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Grade Impact */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Dampak Nilai
          </h4>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round((gradeImpact?.attendanceScore || 0) * 100)}%
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Kontribusi ke nilai akhir: {gradeImpact?.contribution || "0%"}
          </p>
        </div>

        {/* Course Progress */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
            Progress Kursus
          </h4>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {courseProgress?.completionRate || "0%"}
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            {courseProgress?.completedClasses || 0}/
            {courseProgress?.totalClasses || 0} kelas
          </p>
        </div>

        {/* Parent Notifications */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">
            Notifikasi Ortu
          </h4>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {parentNotifications?.sent || 0}
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            Notifikasi terkirim bulan ini
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
            Pencapaian
          </h4>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {achievements?.totalBadges || 0}
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Badge kehadiran earned
          </p>
        </div>
      </div>

      {/* Integration Features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h5 className="font-semibold text-gray-900 dark:text-white">
            Sinkronisasi Data
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Data absensi otomatis tersinkron dengan sistem nilai dan progress
            pembelajaran
          </p>
        </div>
        <div className="border-l-4 border-green-500 pl-4">
          <h5 className="font-semibold text-gray-900 dark:text-white">
            Real-time Updates
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Orang tua mendapat notifikasi real-time saat anak check-in/out
          </p>
        </div>
      </div>
    </div>
  );
}
