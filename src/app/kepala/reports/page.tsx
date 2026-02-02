"use client";
import React, { useState, useEffect } from "react";

interface SubjectBreakdown {
  subject: string;
  average: number;
}

interface AcademicReport {
  class: string;
  averageGrade: number;
  attendanceRate: number;
  graduationRate?: number;
  subjectBreakdown: SubjectBreakdown[];
}

const MiniBar = ({ value, percentage, color }: { value: string | number, percentage: number, color: string }) => (
  <div className="flex items-center gap-3">
    <span className="font-semibold text-gray-800 w-14 text-left">{value}</span>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

// Mock data - will be fetched from API when backend endpoint is ready
const defaultReports: AcademicReport[] = [
  { class: "X-IPA-1", averageGrade: 82.5, attendanceRate: 94.2, graduationRate: undefined, subjectBreakdown: [{ subject: "Matematika", average: 80.5 }, { subject: "Fisika", average: 85.0 }] },
  { class: "X-IPA-2", averageGrade: 79.3, attendanceRate: 92.8, graduationRate: undefined, subjectBreakdown: [{ subject: "Matematika", average: 78.2 }, { subject: "Fisika", average: 81.0 }] },
  { class: "XI-IPA-1", averageGrade: 85.1, attendanceRate: 95.5, graduationRate: undefined, subjectBreakdown: [{ subject: "Matematika", average: 84.0 }, { subject: "Fisika", average: 86.5 }] },
  { class: "XII-IPA-1", averageGrade: 88.2, attendanceRate: 96.1, graduationRate: 98.5, subjectBreakdown: [{ subject: "Matematika", average: 87.0 }, { subject: "Fisika", average: 90.0 }] },
];

export default function LaporanAkademikPage() {
  const [reports, setReports] = useState<AcademicReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        // TODO: Replace with actual API endpoint when ready
        // const response = await fetch("/api/kepala/academic-reports");
        // if (response.ok) {
        //   const data = await response.json();
        //   setReports(data.reports || []);
        // }
        setReports(defaultReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports(defaultReports);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">
            Laporan Akademik
          </h1>
          <p className="mt-1 text-md text-gray-600">
            Rekapitulasi data akademik per kelas
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rata-rata Nilai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tingkat Kehadiran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tingkat Kelulusan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.class}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <MiniBar value={report.averageGrade.toFixed(2)} percentage={report.averageGrade} color="bg-blue-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <MiniBar value={`${report.attendanceRate.toFixed(1)}%`} percentage={report.attendanceRate} color="bg-emerald-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {report.graduationRate ? (
                        <MiniBar value={`${report.graduationRate}%`} percentage={report.graduationRate} color="bg-sky-500" />
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Breakdown Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Rincian Nilai per Mata Pelajaran
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div
                key={report.class}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Kelas {report.class}
                </h3>
                <ul>
                  {report.subjectBreakdown.map((subject) => (
                    <li
                      key={subject.subject}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {subject.subject}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {subject.average.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}