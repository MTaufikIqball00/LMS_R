// components/attendance/AttendanceForm.tsx
import React, { useState, useEffect } from "react";

import { useAttendanceActions } from "../../context/AttendanceContext";
import { useAttendanceData } from "../../context/AttendanceDataContext";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import { COURSES } from "../../constants/dashboard";
import { JADWAL_DATA } from "../../constants/jadwal";

interface AttendanceFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function AttendanceForm({
  onSuccess,
  onError,
}: AttendanceFormProps) {
  const { checkIn } = useAttendanceActions();
  const { isLoading: attendanceLoading } = useAttendanceData();

  const {
    location,
    error: locationError,
    loading: locationLoading,
    refreshLocation,
  } = useGeoLocation();

  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    notes: "",
    attendanceType: "present" as "present" | "late" | "permission",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  // Get today's schedule
  useEffect(() => {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const schedule = JADWAL_DATA.filter((item) => item.day === today);
    setTodaySchedule(schedule);
  }, []);

  // Auto-select teacher when subject is selected
  useEffect(() => {
    if (formData.subject) {
      const selectedClass = todaySchedule.find(
        (item) => item.subject === formData.subject
      );
      if (selectedClass) {
        setFormData((prev) => ({ ...prev, teacher: selectedClass.teacher }));
      }
    }
  }, [formData.subject, todaySchedule]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      setSubmitError(
        "Lokasi belum tersedia. Silakan refresh lokasi terlebih dahulu."
      );
      return;
    }

    if (!formData.subject) {
      setSubmitError("Pilih mata pelajaran terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const currentTime = new Date();
      const selectedSchedule = todaySchedule.find(
        (item) => item.subject === formData.subject
      );

      // Determine attendance status based on time
      let status: "present" | "late" | "permission" = formData.attendanceType;
      if (formData.attendanceType === "present" && selectedSchedule) {
        const scheduleTime = new Date();
        const [hours, minutes] = selectedSchedule.time.split(":");
        scheduleTime.setHours(parseInt(hours), parseInt(minutes));

        if (currentTime > scheduleTime) {
          const timeDiff =
            (currentTime.getTime() - scheduleTime.getTime()) / (1000 * 60); // minutes
          if (timeDiff > 15) {
            // Late if more than 15 minutes
            status = "late";
          }
        }
      }

      await checkIn({
        subject: formData.subject,
        teacher: formData.teacher,
        date: new Date().toISOString().split("T")[0],
        checkInTime: new Date().toISOString(),
        status,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        notes: formData.notes,
      });

      // Reset form
      setFormData({
        subject: "",
        teacher: "",
        notes: "",
        attendanceType: "present",
      });

      onSuccess?.();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Gagal melakukan check-in";
      setSubmitError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationStatus = () => {
    if (locationLoading)
      return { color: "text-yellow-600", text: "Mengambil lokasi..." };
    if (locationError)
      return { color: "text-red-600", text: `Error: ${locationError}` };
    if (location) return { color: "text-green-600", text: "Lokasi ditemukan" };
    return { color: "text-gray-600", text: "Tidak ada lokasi" };
  };

  const locationStatus = getLocationStatus();

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Form Absensi Manual
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Isi form untuk melakukan check-in manual
        </p>
      </div>

      {/* Location Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status Lokasi:
          </span>
          <span className={`text-sm font-semibold ${locationStatus.color}`}>
            {locationStatus.text}
          </span>
        </div>
        {location && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <div>Lat: {location.latitude.toFixed(6)}</div>
            <div>Long: {location.longitude.toFixed(6)}</div>
            <div>Akurasi: {location.accuracy.toFixed(0)}m</div>
          </div>
        )}
        <button
          onClick={refreshLocation}
          disabled={locationLoading}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
        >
          {locationLoading ? "Mengambil lokasi..." : "Refresh Lokasi"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Mata Pelajaran <span className="text-red-500">*</span>
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Pilih Mata Pelajaran
            </option>
            {todaySchedule.length > 0
              ? todaySchedule.map((schedule, index) => (
                  <option key={index} value={schedule.subject}>
                    {schedule.subject} - {schedule.time}
                  </option>
                ))
              : COURSES.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
          </select>
        </div>

        {/* Teacher (Auto-filled) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Guru Pengampu
          </label>
          <input
            type="text"
            name="teacher"
            value={formData.teacher}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Akan terisi otomatis"
            readOnly
          />
        </div>

        {/* Attendance Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Jenis Kehadiran
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: "present",
                label: "Hadir",
                color:
                  "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300",
              },
              {
                value: "late",
                label: "Terlambat",
                color:
                  "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300",
              },
              {
                value: "permission",
                label: "Izin",
                color:
                  "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300",
              },
            ].map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="attendanceType"
                  value={type.value}
                  checked={formData.attendanceType === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div
                  className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all duration-200 ${
                    formData.attendanceType === type.value
                      ? type.color
                      : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                  }`}
                >
                  {type.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Tambahkan catatan jika diperlukan..."
          />
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {submitError}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !location ||
              !formData.subject ||
              attendanceLoading
            }
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </>
            ) : (
              "Submit Absensi"
            )}
          </button>
        </div>
      </form>

      {/* Today's Schedule Info */}
      {todaySchedule.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
            📅 Jadwal Hari Ini:
          </h4>
          <div className="space-y-1">
            {todaySchedule.map((schedule, index) => (
              <div
                key={index}
                className="text-xs text-blue-600 dark:text-blue-400"
              >
                {schedule.time} - {schedule.subject} ({schedule.teacher})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
