// components/ui/TugasList.tsx
import { useState, useEffect } from "react";
import { AssignmentWithStatus } from "../../../app/tugas/page";
import TugasCard from "./TugasCard";

// ✅ Create a mock function to simulate getQuizStatus since we removed the import
const getQuizStatus = (tugas: AssignmentWithStatus): string => {
  if (tugas.type !== "quiz") return "not-available";

  const now = new Date();
  const dueDate = new Date(tugas.dueDate || new Date());

  if (now < dueDate) {
    return "active";
  } else {
    return "closed";
  }
};

export default function TugasList() {
  const [allTugas, setAllTugas] = useState<AssignmentWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Fetch data from API instead of using constants
    const fetchTugas = async () => {
      try {
        const response = await fetch("/api/tugas");
        if (response.ok) {
          const data = await response.json();
          setAllTugas(data);
        } else {
          // ✅ Fallback to mock data if API fails
          const mockData: AssignmentWithStatus[] = [
            {
              id: "1",
              teacherId: "teacher1",
              title: "Essay Tentang Lingkungan",
              description:
                "Tulis essay 500 kata tentang pelestarian lingkungan",
              type: "essay",
              dueDate: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              createdAt: new Date().toISOString(),
              status: "pending",
              grade: null,
              subject: "Bahasa Indonesia",
              priority: "high",
              points: 100,
              className: "12 IPA 1",
              submissions: 0,
              totalStudents: 30,
            },
            {
              id: "2",
              teacherId: "teacher1",
              title: "Quiz Matematika",
              description: "Quiz tentang aljabar dan geometri",
              type: "quiz",
              dueDate: new Date(
                Date.now() + 1 * 24 * 60 * 60 * 1000
              ).toISOString(),
              createdAt: new Date().toISOString(),
              status: "pending",
              grade: null,
              subject: "Matematika",
              priority: "medium",
              points: 50,
              className: "12 IPA 2",
              submissions: 5,
              totalStudents: 32,
            },
            {
              id: "3",
              teacherId: "teacher2",
              title: "Presentasi Sejarah Indonesia",
              description: "Presentasi 10 menit tentang kemerdekaan Indonesia",
              type: "presentation",
              dueDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              createdAt: new Date().toISOString(),
              status: "submitted",
              grade: 85,
              subject: "Sejarah",
              priority: "low",
              points: 75,
              className: "11 IPS 1",
              submissions: 28,
              totalStudents: 28,
            },
          ];
          setAllTugas(mockData);
        }
      } catch (error) {
        console.error("Error fetching tugas:", error);
        // Set empty array on error
        setAllTugas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTugas();
  }, []);

  // Filter tugas berdasarkan status quiz
  const activeTugas = allTugas.filter((tugas) => {
    if (tugas.type === "quiz") {
      const quizStatus = getQuizStatus(tugas);
      return quizStatus === "active" || quizStatus === "not-started";
    }
    return tugas.status === "pending";
  });

  const completedTugas = allTugas.filter((tugas) => {
    if (tugas.type === "quiz") {
      const quizStatus = getQuizStatus(tugas);
      return (
        quizStatus === "closed" ||
        tugas.status === "submitted" ||
        tugas.status === "graded"
      );
    }
    return tugas.status === "submitted" || tugas.status === "graded";
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Memuat tugas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Assignments */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Tugas Aktif
          </h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            {activeTugas.length} tugas
          </div>
        </div>

        {activeTugas.length > 0 ? (
          <div className="grid gap-6">
            {activeTugas.map((tugas) => (
              <TugasCard key={tugas.id} tugas={tugas} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-sm rounded-2xl border border-white/30">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tidak ada tugas aktif
            </h3>
            <p className="text-gray-600">
              Semua tugas sudah selesai atau belum ada tugas baru.
            </p>
          </div>
        )}
      </div>

      {/* Completed Assignments */}
      {completedTugas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-green-800 to-emerald-800 bg-clip-text text-transparent">
              Tugas Selesai
            </h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {completedTugas.length} selesai
            </div>
          </div>

          <div className="grid gap-6">
            {completedTugas.map((tugas) => (
              <TugasCard key={tugas.id} tugas={tugas} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no data */}
      {allTugas.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-gradient-to-br from-white/60 to-slate-50/60 backdrop-blur-sm rounded-2xl border border-white/30">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Tidak ada tugas
          </h3>
          <p className="text-gray-600 mb-6">
            Belum ada tugas yang tersedia saat ini.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Muat Ulang
          </button>
        </div>
      )}
    </div>
  );
}
