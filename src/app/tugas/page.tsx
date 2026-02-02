"use client";

import { useState, useEffect } from "react";
import TugasCard from "../components/ui/TugasCard";
import TugasStats from "../components/ui/TugasStats";
import { Assignment } from "../api/tugas/store"; // Using the centralized type

// Define a new type that includes the status from the API
// This type now correctly reflects the full assignment data plus student-specific status
export type AssignmentWithStatus = Assignment & {
  status: "pending" | "submitted" | "graded" | "overdue";
  grade: number | null;
  // The other properties like `subject`, `priority`, etc., are now part of the base `Assignment` type
};

export default function TugasPage() {
  const [allTugas, setAllTugas] = useState<AssignmentWithStatus[]>([]);
  const [filteredTugas, setFilteredTugas] = useState<AssignmentWithStatus[]>(
    []
  );
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    submitted: 0,
    graded: 0,
    overdue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<
    "all" | "pending" | "submitted" | "graded"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchTugas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/tugas");
        if (!response.ok) {
          throw new Error("Gagal memuat tugas");
        }
        const data: AssignmentWithStatus[] = await response.json();
        setAllTugas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTugas();
  }, []);

  // Filter and calculate stats
  useEffect(() => {
    let processedTugas = [...allTugas];

    // Filter by search term first
    if (searchTerm) {
      processedTugas = processedTugas.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filter !== "all") {
      processedTugas = processedTugas.filter((t) => t.status === filter);
    }

    setFilteredTugas(processedTugas);

    // Calculate stats from the full dataset
    const total = allTugas.length;
    const pending = allTugas.filter((t) => t.status === "pending").length;
    const submitted = allTugas.filter((t) => t.status === "submitted").length;
    const graded = allTugas.filter((t) => t.status === "graded").length;
    // Overdue logic can be implemented here if needed, based on dueDate
    setStats({ total, pending, submitted, graded, overdue: 0 });
  }, [filter, searchTerm, allTugas]);

  const filterButtons = [
    { key: "all", label: "Semua", count: stats.total },
    { key: "pending", label: "Belum Dikerjakan", count: stats.pending },
    { key: "submitted", label: "Sudah Dikirim", count: stats.submitted },
    { key: "graded", label: "Sudah Dinilai", count: stats.graded },
  ];

  if (isLoading) {
    return <div className="text-white text-center p-10">Memuat tugas...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-10">Error: {error}</div>;
  }

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
            Tugas & Assignment
          </h1>
          <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
            Kelola dan kerjakan semua tugas pembelajaran Anda dengan mudah dan
            efisien
          </p>
        </div>

        {/* Stats */}
        <TugasStats stats={stats} />

        {/* Filters and Search */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-blue-300/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari tugas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {filterButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => setFilter(button.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === button.key
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/10 text-blue-200/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                {button.label}
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                  {button.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tugas List */}
        <div className="space-y-6">
          {filteredTugas.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-white/10">
                <div className="text-6xl mb-6 opacity-50">📝</div>
                <h3 className="text-white text-2xl font-bold mb-4">
                  Tidak Ada Tugas
                </h3>
                <p className="text-blue-200/70 text-lg">
                  {searchTerm
                    ? "Tidak ada tugas yang cocok dengan pencarian Anda"
                    : "Belum ada tugas yang tersedia saat ini"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Counter */}
              <div className="text-center mb-6">
                <p className="text-blue-200/80 text-lg">
                  Menampilkan{" "}
                  <span className="text-white font-semibold">
                    {filteredTugas.length}
                  </span>{" "}
                  tugas
                </p>
              </div>

              {/* Tugas Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTugas.map((tugasItem) => (
                  <TugasCard key={tugasItem.id} tugas={tugasItem} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
