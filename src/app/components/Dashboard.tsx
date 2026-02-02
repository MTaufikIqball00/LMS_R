import Image from "next/image";
import Link from "next/link";
import { SCHEDULE_DAYS, COURSES } from "../constants/dashboard";
import ScheduleCard from "./ui/ScheduleCard";
import CourseCard from "./ui/CourseCard";
import type { Course } from "../types/dashboard";

// Fungsi untuk mendapatkan nama hari dalam bahasa Indonesia
function getCurrentDayInIndonesian(): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const today = new Date();
  return days[today.getDay()];
}

// Fungsi untuk memfilter mata pelajaran berdasarkan hari
function getTodaysCourses(courses: Course[]): Course[] {
  const currentDay = getCurrentDayInIndonesian();

  // Cari jadwal hari ini
  const todaySchedule = SCHEDULE_DAYS.find(
    (schedule) => schedule.day === currentDay
  );

  if (!todaySchedule || !todaySchedule.subjects) {
    return []; // Tidak ada mata pelajaran hari ini
  }

  // Filter mata pelajaran yang ada di jadwal hari ini
  return courses.filter((course) =>
    (todaySchedule.subjects ?? []).some(
      (subject) =>
        course.title.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(course.title.toLowerCase())
    )
  );
}

export default function Dashboard() {
  const todaysCourses = getTodaysCourses(COURSES);
  const currentDay = getCurrentDayInIndonesian();

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <ScheduleCard schedules={SCHEDULE_DAYS} />

        {/* Dashboard Info & Help Cards */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Dashboard Card */}
          <section className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="font-bold text-black text-xl mb-2">
                Dashboard LMS Disdik Jabar
              </h1>
              <p className="text-gray-600 text-sm max-w-md mb-3">
                Platform pembelajaran digital yang menyediakan berbagai materi
                dan alat pembelajaran interaktif untuk mendukung pendidikan
                berkualitas.
              </p>
              <Link
                href="/about"
                className="text-blue-600 text-sm hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Pelajari lebih lanjut →
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-lg shadow-sm">
                <Image
                  src="/assets/logo.png"
                  alt="Logo Dinas Pendidikan Jawa Barat"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </section>

          {/* Help Card */}
          <section className="bg-blue-50 shadow-md rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                ?
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Butuh Bantuan?
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Tim support siap membantu Anda 24/7
                </p>
                <Link
                  href="/help"
                  className="text-blue-600 text-sm hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  Hubungi Support →
                </Link>
              </div>
            </div>

            <div className="bg-white px-6 py-2 rounded-xl text-gray-400 font-semibold cursor-not-allowed opacity-50">
              Bantuan
            </div>
          </section>
        </div>
      </div>

      {/* Course Overview Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-black text-xl">
              Mata Pelajaran Hari Ini ({currentDay})
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {todaysCourses.length > 0
                ? `${todaysCourses.length} mata pelajaran tersedia hari ini`
                : "Tidak ada mata pelajaran hari ini"}
            </p>
          </div>
          <Link
            href="/matapelajaran"
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Lihat Semua Pelajaran →
          </Link>
        </div>

        {todaysCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {todaysCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                priority={index < 2} // Load first 2 images with priority
              />
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">📚</div>
            <h3 className="text-gray-800 text-xl font-semibold mb-2">
              Tidak Ada Mata Pelajaran Hari Ini
            </h3>
            <p className="text-gray-600 mb-4">
              Hari {currentDay} tidak ada jadwal mata pelajaran yang tersedia.
            </p>
            <Link
              href="/matapelajaran"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Lihat Semua Mata Pelajaran
            </Link>
          </div>
        )}

        {/* Info Card tentang sistem filtering */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Info:</strong> Mata pelajaran yang ditampilkan disini
                disesuaikan dengan jadwal hari {currentDay}. Untuk melihat semua
                mata pelajaran yang tersedia, klik "Lihat Semua Pelajaran".
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
