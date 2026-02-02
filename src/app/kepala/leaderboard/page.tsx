"use client";
import React, { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  class: string;
  averageScore: number;
  activityLevel: number;
}

const getCombinedScore = (student: Student) => {
  return (student.averageScore || 0) * 0.6 + (student.activityLevel || 0) * 0.4;
};

const getBadge = (rank: number) => {
  if (rank === 1)
    return (
      <span className="text-xl" role="img" aria-label="Gold Medal">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="text-xl" role="img" aria-label="Silver Medal">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="text-xl" role="img" aria-label="Bronze Medal">
        🥉
      </span>
    );
  return null;
};

export default function LeaderboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/kepala/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const sortedStudents = [...students]
    .sort((a, b) => getCombinedScore(b) - getCombinedScore(a))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard Murid</h1>
          <p className="mt-1 text-md text-gray-600">
            Peringkat murid berdasarkan performa akademik dan keaktifan
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Top 10 Murid Berprestasi
            </h2>
          </div>
          {sortedStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada data murid
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sortedStudents.map((student, index) => {
                const rank = index + 1;
                const score = getCombinedScore(student);

                return (
                  <li
                    key={student.id}
                    className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-12 text-center">
                        <span className="text-2xl font-bold text-gray-500">
                          {rank}
                        </span>
                        <div className="mt-1">{getBadge(rank)}</div>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Kelas: {student.class}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {score.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Skor Gabungan</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}