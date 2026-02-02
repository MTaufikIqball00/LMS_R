"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Mock data for class list - including general classes
const mockClasses = [
  {
    id: "10a",
    name: "Kelas 10A",
    description: "Diskusi khusus untuk siswa kelas 10A.",
  },
  {
    id: "10b",
    name: "Kelas 10B",
    description: "Diskusi khusus untuk siswa kelas 10B.",
  },
  {
    id: "10-umum",
    name: "Kelas 10 Umum",
    description: "Diskusi umum untuk semua siswa kelas 10.",
  },
  {
    id: "11a",
    name: "Kelas 11A",
    description: "Diskusi khusus untuk siswa kelas 11A.",
  },
  {
    id: "11-umum",
    name: "Kelas 11 Umum",
    description: "Diskusi umum untuk semua siswa kelas 11.",
  },
  {
    id: "12-umum",
    name: "Kelas 12 Umum",
    description: "Diskusi umum untuk semua siswa kelas 12.",
  },
];

export default function SubjectPage() {
  const params = useParams();
  const subject = params.subject as string;

  // Capitalize first letter for display
  const displaySubject = subject.charAt(0).toUpperCase() + subject.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumbs */}
        <div className="mb-10">
          <nav className="text-sm mb-4 text-gray-500 dark:text-gray-400">
            <Link
              href="/forum"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Forum
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {displaySubject}
            </span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Forum Diskusi: {displaySubject}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Pilih kelas untuk bergabung dalam diskusi.
          </p>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockClasses.map((classItem) => (
            <Link
              href={`/forum/${subject}/${classItem.id}`}
              key={classItem.id}
              className="group block bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out border border-transparent hover:border-blue-500"
            >
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                    {classItem.name.match(/(\d+)/)?.[0] || "G"}
                  </div>
                  <h2 className="ml-4 font-bold text-2xl text-gray-800 dark:text-white">
                    {classItem.name}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 h-12">
                  {classItem.description}
                </p>
                <div className="mt-6 flex items-center justify-end text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  Masuk Diskusi
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
